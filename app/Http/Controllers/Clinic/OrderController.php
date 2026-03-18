<?php

namespace App\Http\Controllers\Clinic;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Lab;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Service;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $clinicId = Auth::user()->clinic_id;

        $query = Order::with(['patient', 'lab', 'service'])
            ->where('clinic_id', $clinicId);

        // Apply shared filters
        $this->orderService->applyFilters($query, $request);

        // Clinic-specific filters
        if ($request->filled('lab_id')) {
            $query->where('lab_id', $request->lab_id);
        }

        if ($request->filled('service_id')) {
            $query->whereHas('service', function ($q) use ($request) {
                $q->where('id', $request->service_id);
            });
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        // Get filter options
        $labs = Lab::whereHas('orders', function ($q) use ($clinicId) {
            $q->where('clinic_id', $clinicId);
        })->select('id', 'name')->get();

        $services = Service::whereHas('orders', function ($q) use ($clinicId) {
            $q->where('clinic_id', $clinicId);
        })->select('id', 'name')->get();

        return Inertia::render('Clinic/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'priority', 'search', 'lab_id', 'service_id', 'date_from', 'date_to', 'payment_status']),
            'statusOptions' => collect(OrderStatus::cases())->map(fn($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
            'labs' => $labs,
            'services' => $services,
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
        $templates = \App\Models\OrderTemplate::where('clinic_id', Auth::user()->clinic_id)->get();

        return Inertia::render('Clinic/Orders/Create', [
            'patients' => $patients,
            'labs' => $labs,
            'templates' => $templates,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $order = $this->orderService->createOrder(
            $validated,
            Auth::user()->clinic_id,
            Auth::id(),
        );

        // Handle File Uploads
        if ($request->hasFile('files')) {
            $this->orderService->uploadFiles($order, $request->file('files'));
        }

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
            'file' => 'required|file|max:51200|extensions:pdf,jpg,jpeg,png,stl,dcm,zip',
        ]);

        $order = Order::where('clinic_id', Auth::user()->clinic_id)
            ->findOrFail($id);

        if ($request->file('file')) {
            $this->orderService->uploadFiles($order, [$request->file('file')]);
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
        $service = Service::findOrFail($validated['service_id']);

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
        $templates = \App\Models\OrderTemplate::where('clinic_id', Auth::user()->clinic_id)->get();

        return Inertia::render('Clinic/Orders/Create', [
            'patients' => $patients,
            'labs' => $labs,
            'templates' => $templates,
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

        if ($this->orderService->cancelOrder($order, Auth::id())) {
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
        \Illuminate\Support\Facades\Storage::disk('public')->delete($file->path);
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }

    /**
     * Bulk cancel selected orders.
     */
    public function bulkCancel(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'integer|exists:orders,id',
        ]);

        $cancelled = $this->orderService->bulkCancel(
            $request->order_ids,
            Auth::user()->clinic_id,
            Auth::id(),
        );

        return redirect()->back()->with('success', "$cancelled order(s) cancelled successfully.");
    }

    /**
     * Bulk export selected orders as CSV.
     */
    public function bulkExport(Request $request)
    {
        $clinicId = Auth::user()->clinic_id;
        $orderIds = $request->input('order_ids', []);

        $orders = Order::with(['patient', 'lab', 'service'])
            ->where('clinic_id', $clinicId)
            ->when(!empty($orderIds), fn($q) => $q->whereIn('id', $orderIds))
            ->latest()
            ->get();

        $filename = 'orders_export_' . now()->format('Y-m-d_His') . '.csv';

        return response()->stream(
            $this->orderService->exportOrdersCsv($orders),
            200,
            [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"$filename\"",
            ]
        );
    }
}
