<?php

namespace App\Listeners;

use App\Events\OrderStatusUpdated;
use App\Events\NotificationCreated;
use App\Mail\OrderStatusUpdateMail;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendOrderStatusUpdateNotification
{
    public function __construct()
    {
        //
    }

    /**
     * Handle the event: create in-app notifications for clinic users + send email.
     */
    public function handle(OrderStatusUpdated $event): void
    {
        $order = $event->order;
        $order->load(['clinic.users', 'lab', 'patient', 'service']);

        $statusLabel = $order->status->label();

        // ── Create in-app notification for ALL clinic (dentist) users ─
        if ($order->clinic) {
            foreach ($order->clinic->users as $clinicUser) {
                $notification = Notification::create([
                    'user_id' => $clinicUser->id,
                    'type' => 'order_status',
                    'title' => 'Statut mis à jour',
                    'body' => sprintf(
                        'Commande #%d est maintenant "%s"',
                        $order->id,
                        $statusLabel
                    ),
                    'data' => ['order_id' => $order->id],
                ]);

                event(new NotificationCreated($notification));
            }
        }

        // ── Also notify lab users so they see the change reflected ──
        if ($order->lab) {
            foreach ($order->lab->users as $labUser) {
                $notification = Notification::create([
                    'user_id' => $labUser->id,
                    'type' => 'order_status',
                    'title' => 'Statut mis à jour',
                    'body' => sprintf(
                        'Commande #%d passée à "%s"',
                        $order->id,
                        $statusLabel
                    ),
                    'data' => ['order_id' => $order->id],
                ]);

                event(new NotificationCreated($notification));
            }
        }

        // ── Send email to clinic ────────────────────────────────────
        if ($order->clinic) {
            $clinicUser = $order->clinic->users->first();
            if ($clinicUser && $clinicUser->email) {
                try {
                    Mail::to($clinicUser->email)->send(new OrderStatusUpdateMail($order));
                } catch (\Exception $e) {
                    Log::warning('Failed to send status update email: ' . $e->getMessage());
                }
            }
        }
    }
}
