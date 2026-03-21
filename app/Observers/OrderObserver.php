<?php

namespace App\Observers;

use App\Models\Order;
use App\Enums\OrderStatus;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        // Notify the lab that a new order has been received
        NotificationService::notifyLab(
            $order->lab_id,
            'new_order',
            'New Order Received',
            "Order #{$order->id} for patient {$order->patient->first_name} {$order->patient->last_name} has been placed.",
            ['order_id' => $order->id]
        );
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->isDirty('status')) {
            $newStatus = $order->status;
            $statusLabel = $newStatus->label();
            
            $user = auth()->user();
            $isClinicUser = $user && in_array($user->role, ['dentist', 'clinic_staff']);
            $isLabUser = $user && in_array($user->role, ['lab_owner', 'lab_tech']);

            // If lab updates status (or system), notify clinic
            if (!$isClinicUser) {
                NotificationService::notifyClinic(
                    $order->clinic_id,
                    'order_status_update',
                    "Order Status Updated",
                    "Order #{$order->id} is now: {$statusLabel}.",
                    ['order_id' => $order->id, 'status' => $newStatus->value]
                );

                if ($newStatus === OrderStatus::Shipped) {
                    NotificationService::notifyClinic(
                        $order->clinic_id,
                        'order_shipped',
                        "Order En Route",
                        "A package for Order #{$order->id} has been dispatched by the lab.",
                        ['order_id' => $order->id]
                    );
                }
            }

            // If clinic updates status (e.g., cancelled), notify lab
            if (!$isLabUser) {
                NotificationService::notifyLab(
                    $order->lab_id,
                    'order_status_update',
                    "Order Status Updated",
                    "Order #{$order->id} is now: {$statusLabel}.",
                    ['order_id' => $order->id, 'status' => $newStatus->value]
                );
            }
        }
    }
}
