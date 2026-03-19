<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class OrderService
{
    /**
     * Apply common filters to an orders query.
     */
    public function applyFilters(Builder $query, Request $request): Builder
    {
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

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        return $query;
    }

    /**
     * Create a new order with initial status history and event dispatch.
     */
    public function createOrder(array $validated, int $clinicId, int $userId): Order
    {
        $service = Service::findOrFail($validated['service_id']);

        $order = Order::create([
            'clinic_id' => $clinicId,
            'user_id' => $userId,
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

        $order->history()->create([
            'status' => OrderStatus::New->value,
            'changed_by_user_id' => $userId,
        ]);

        \App\Events\OrderSubmitted::dispatch($order);

        return $order;
    }

    /**
     * Upload files to an order.
     */
    public function uploadFiles(Order $order, array $files): void
    {
        foreach ($files as $file) {
            $path = $file->store('order_files/' . $order->id, 'public');

            $order->files()->create([
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);
        }
    }

    /**
     * Cancel an order if it's in a cancellable state.
     *
     * @return bool True if cancelled, false if not allowed.
     */
    public function cancelOrder(Order $order, int $userId): bool
    {
        if (in_array($order->status->value, ['new', 'rejected'])) {
            $order->transitionTo(OrderStatus::Cancelled, $userId);
            return true;
        }

        return false;
    }

    /**
     * Bulk cancel orders for a clinic.
     */
    public function bulkCancel(array $orderIds, int $clinicId, int $userId): int
    {
        $cancelled = 0;

        $orders = Order::where('clinic_id', $clinicId)
            ->whereIn('id', $orderIds)
            ->whereIn('status', ['new', 'rejected'])
            ->get();

        foreach ($orders as $order) {
            $order->transitionTo(OrderStatus::Cancelled, $userId);
            $cancelled++;
        }

        return $cancelled;
    }

    /**
     * Generate CSV export data for orders.
     */
    public function exportOrdersCsv(iterable $orders): \Closure
    {
        return function () use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Patient', 'Lab', 'Service', 'Status', 'Priority', 'Due Date', 'Created At']);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->patient->first_name . ' ' . $order->patient->last_name,
                    $order->lab->name ?? 'N/A',
                    $order->service->name ?? 'N/A',
                    $order->status->value,
                    $order->priority,
                    $order->due_date,
                    $order->created_at->format('Y-m-d H:i'),
                ]);
            }
            fclose($file);
        };
    }
}
