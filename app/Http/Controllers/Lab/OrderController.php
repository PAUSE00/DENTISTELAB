<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders assigned to the lab.
     */
    public function index(Request $request)
    {
        $query = Order::with(['patient', 'clinic', 'service'])
            ->where('lab_id', Auth::user()->lab_id);

        // ── Filtering ─────────────────────────────────────
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Lab/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'priority', 'search', 'payment_status']),
            'statusOptions' => collect(OrderStatus::cases())->map(fn($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
        ]);
    }

    /**
     * Display the specified order details.
     */
    public function show($id)
    {
        $order = Order::with(['patient', 'clinic', 'service', 'files', 'history.user'])
            ->findOrFail($id);

        $this->authorize('view', $order);

        return Inertia::render('Lab/Orders/Show', [
            'order' => $order,
            'allowedTransitions' => collect($order->status->allowedTransitions())->map(fn($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ])->values(),
        ]);
    }

    /**
     * Update the status of an order (using transition rules).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required',
            'rejection_reason' => 'nullable|string|required_if:status,rejected',
        ]);

        $order = Order::findOrFail($id);
        $this->authorize('update', $order);

        $targetStatus = OrderStatus::tryFrom($request->status);

        if (! $targetStatus) {
            return redirect()->back()->withErrors(['status' => 'Invalid status value.']);
        }

        if (! $order->status->canTransitionTo($targetStatus)) {
            return redirect()->back()->withErrors([
                'status' => "Cannot transition from '{$order->status->value}' to '{$targetStatus->value}'.",
            ]);
        }

        try {
            $order->transitionTo($targetStatus, Auth::id(), $request->rejection_reason);
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['status' => $e->getMessage()]);
        }

        return redirect()->back()->with('success', 'Order status updated to ' . $targetStatus->label());
    }

    /**
     * Update the payment status of an order.
     */
    public function updatePaymentStatus(Request $request, $id)
    {
        $request->validate([
            'payment_status' => 'required|in:unpaid,partial,paid',
            'final_price' => 'nullable|numeric|min:0',
        ]);

        $order = Order::findOrFail($id);
        $this->authorize('update', $order);

        $order->update($request->only(['payment_status', 'final_price']));

        return redirect()->back()->with('success', 'Payment status updated.');
    }

    /**
     * Upload a file to the order.
     */
    public function uploadFile(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:51200|extensions:pdf,jpg,jpeg,png,stl,dcm,zip', // Max 50MB per PRD, using extensions for STL reliability
        ]);

        $order = Order::findOrFail($id);
        $this->authorize('update', $order);

        if ($request->file('file')) {
            $file = $request->file('file');
            $path = $file->store('order_files/' . $order->id, 'public');

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
     * Delete a file from the order.
     */
    public function deleteFile($id, $fileId)
    {
        $order = Order::where('lab_id', Auth::user()->lab_id)->findOrFail($id);
        $this->authorize('update', $order);

        $file = $order->files()->findOrFail($fileId);

        // Delete from storage
        \Illuminate\Support\Facades\Storage::disk('public')->delete($file->path);

        // Delete record
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }
}
