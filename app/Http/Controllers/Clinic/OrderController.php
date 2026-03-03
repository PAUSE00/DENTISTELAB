<?php

namespace App\Http\Controllers\Clinic;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Lab;
use App\Models\Order;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['patient', 'lab', 'service'])
            ->where('clinic_id', Auth::user()->clinic_id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Clinic/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $patients = Patient::where('clinic_id', Auth::user()->clinic_id)
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->first_name . ' ' . $patient->last_name,
                ];
            });

        // Get only labs connected to this clinic
        $labs = Auth::user()->clinic->labs()->with('services')->get();

        return Inertia::render('Clinic/Orders/Create', [
            'patients' => $patients,
            'labs' => $labs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $service = \App\Models\Service::findOrFail($validated['service_id']);

        // Create the order
        $order = Order::create([
            'clinic_id' => Auth::user()->clinic_id,
            'lab_id' => $validated['lab_id'],
            'patient_id' => $validated['patient_id'],
            'service_id' => $validated['service_id'],
            'status' => OrderStatus::New,
            'priority' => $validated['priority'],
            'due_date' => $validated['due_date'],
            'teeth' => $validated['teeth'],
            'shade' => $validated['shade'],
            'material' => $validated['material'],
            'instructions' => $validated['instructions'],
            'price' => $service->price,
        ]);

        // Log initial status
        $order->history()->create([
            'status' => OrderStatus::New->value,
            'changed_by_user_id' => Auth::id(),
        ]);

        // Handle File Uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('order_files/' . $order->id, 'public');

                $order->files()->create([
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        // Dispatch the event
        \App\Events\OrderSubmitted::dispatch($order);

        return redirect()->route('clinic.orders.index')
            ->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(['patient', 'lab', 'service', 'files', 'history.user'])
            ->findOrFail($id);

        $this->authorize('view', $order);

        return Inertia::render('Clinic/Orders/Show', [
            'order' => $order
        ]);
    }
    /**
     * Upload a file to the order.
     */
    public function uploadFile(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:51200|extensions:pdf,jpg,jpeg,png,stl,dcm,zip', // Max 50MB per PRD, using extensions for STL reliability
        ]);

        $order = Order::where('clinic_id', Auth::user()->clinic_id)
            ->findOrFail($id);

        if ($request->file('file')) {
            $file = $request->file('file');
            $path = $file->store('order_files', 'public');

            $order->files()->create([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);

            return redirect()->back()->with('success', 'File uploaded successfully.');
        }

        return redirect()->back()->with('error', 'No file uploaded.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $order = Order::where('clinic_id', Auth::user()->clinic_id)
            ->where('status', OrderStatus::New)
            ->findOrFail($id);

        $this->authorize('update', $order);

        $patients = Patient::where('clinic_id', Auth::user()->clinic_id)
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->first_name . ' ' . $patient->last_name,
                ];
            });

        $labs = Auth::user()->clinic->labs()->with('services')->get();

        return Inertia::render('Clinic/Orders/Edit', [
            'order' => $order,
            'patients' => $patients,
            'labs' => $labs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrderRequest $request, $id)
    {
        $order = Order::where('clinic_id', Auth::user()->clinic_id)
            ->where('status', OrderStatus::New)
            ->findOrFail($id);

        $this->authorize('update', $order);

        $validated = $request->validated();
        $service = \App\Models\Service::findOrFail($validated['service_id']);

        $order->update([
            'lab_id' => $validated['lab_id'],
            'patient_id' => $validated['patient_id'],
            'service_id' => $validated['service_id'],
            'priority' => $validated['priority'],
            'due_date' => $validated['due_date'],
            'teeth' => $validated['teeth'],
            'shade' => $validated['shade'],
            'material' => $validated['material'],
            'instructions' => $validated['instructions'],
            'price' => $service->price,
        ]);

        return redirect()->route('clinic.orders.show', $order->id)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Duplicate an existing order — redirects to create with pre-filled data.
     */
    public function duplicate($id)
    {
        $order = Order::findOrFail($id);
        $this->authorize('view', $order);

        $patients = Patient::where('clinic_id', Auth::user()->clinic_id)
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->first_name . ' ' . $patient->last_name,
                ];
            });

        $labs = Auth::user()->clinic->labs()->with('services')->get();

        return Inertia::render('Clinic/Orders/Create', [
            'patients' => $patients,
            'labs' => $labs,
            'duplicate' => [
                'patient_id' => $order->patient_id,
                'lab_id' => $order->lab_id,
                'service_id' => $order->service_id,
                'priority' => $order->priority,
                'teeth' => $order->teeth,
                'shade' => $order->shade,
                'material' => $order->material,
                'instructions' => $order->instructions,
            ],
        ]);
    }

    /**
     * Cancel an order if it's new or rejected.
     */
    public function cancel($id)
    {
        $order = Order::where('clinic_id', Auth::user()->clinic_id)->findOrFail($id);

        $this->authorize('view', $order);

        if (in_array($order->status->value, ['new', 'rejected'])) {
            $order->transitionTo(\App\Enums\OrderStatus::Cancelled, Auth::id());
            return redirect()->back()->with('success', 'Order cancelled successfully.');
        }

        return redirect()->back()->with('error', 'This order cannot be cancelled.');
    }
    /**
     * Delete a file from the order.
     */
    public function deleteFile($id, $fileId)
    {
        $order = Order::where('clinic_id', Auth::user()->clinic_id)->findOrFail($id);
        $this->authorize('update', $order);

        $file = $order->files()->findOrFail($fileId);

        // Delete from storage
        \Illuminate\Support\Facades\Storage::disk('public')->delete($file->path);

        // Delete record
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }
}
