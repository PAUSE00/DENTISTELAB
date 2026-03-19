<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Order;
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
     * Display a listing of the orders assigned to the lab.
     */
    public function index(Request $request)
    {
        $labId = Auth::user()->lab_id;

        $query = Order::with(['patient', 'clinic', 'service'])
            ->where('lab_id', $labId);

        // Apply shared filters
        $this->orderService->applyFilters($query, $request);

        // Lab-specific filters
        if ($request->filled('clinic_id')) {
            $query->where('clinic_id', $request->clinic_id);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        // Get filter options
        $clinics = Clinic::whereHas('orders', function ($q) use ($labId) {
            $q->where('lab_id', $labId);
        })->select('id', 'name')->get();

        return Inertia::render('Lab/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'priority', 'search', 'payment_status', 'clinic_id', 'date_from', 'date_to']),
            'statusOptions' => collect(OrderStatus::cases())->map(fn($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
            'clinics' => $clinics,
        ]);
    }

    /**
     * Display the specified order details.
     */
    public function show($id)
    {
        $order = Order::with(['patient', 'clinic', 'service', 'files', 'history.user', 'notes.user', 'payments.recordedBy'])
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
            'file' => 'required|file|max:51200|extensions:pdf,jpg,jpeg,png,stl,dcm,zip',
        ]);

        $order = Order::findOrFail($id);
        $this->authorize('update', $order);

        if ($request->file('file')) {
            $this->orderService->uploadFiles($order, [$request->file('file')]);
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

        \Illuminate\Support\Facades\Storage::disk('public')->delete($file->path);
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }

    /**
     * Bulk update status on selected orders.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'integer|exists:orders,id',
            'status' => 'required|string',
        ]);

        $labId = Auth::user()->lab_id;
        $targetStatus = OrderStatus::tryFrom($request->status);

        if (! $targetStatus) {
            return redirect()->back()->withErrors(['status' => 'Invalid status value.']);
        }

        $updated = 0;
        $orders = Order::where('lab_id', $labId)
            ->whereIn('id', $request->order_ids)
            ->get();

        foreach ($orders as $order) {
            if ($order->status->canTransitionTo($targetStatus)) {
                try {
                    $order->transitionTo($targetStatus, Auth::id());
                    $updated++;
                } catch (\InvalidArgumentException $e) {
                    // Skip orders that can't transition
                }
            }
        }

        return redirect()->back()->with('success', "$updated order(s) updated to {$targetStatus->label()}.");
    }
}
