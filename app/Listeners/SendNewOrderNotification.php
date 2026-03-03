<?php

namespace App\Listeners;

use App\Events\OrderSubmitted;
use App\Events\NotificationCreated;
use App\Mail\NewOrderMail;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendNewOrderNotification
{
    public function __construct()
    {
        //
    }

    /**
     * Handle the event: create in-app notification for lab users + send email.
     */
    public function handle(OrderSubmitted $event): void
    {
        $order = $event->order;
        $order->load(['lab.users', 'clinic', 'patient', 'service']);

        // ── Create in-app notification for ALL lab users ──────────
        if ($order->lab) {
            foreach ($order->lab->users as $labUser) {
                $notification = Notification::create([
                    'user_id' => $labUser->id,
                    'type' => 'new_order',
                    'title' => 'Nouvelle commande',
                    'body' => sprintf(
                        'Commande #%d reçue de %s — %s %s',
                        $order->id,
                        $order->clinic->name ?? 'Inconnu',
                        $order->patient->first_name ?? '',
                        $order->patient->last_name ?? ''
                    ),
                    'data' => ['order_id' => $order->id],
                ]);

                event(new NotificationCreated($notification));
            }

            // ── Send email to lab ─────────────────────────────────
            if ($order->lab->email) {
                try {
                    Mail::to($order->lab->email)->send(new NewOrderMail($order));
                } catch (\Exception $e) {
                    // Silently fail — don't block order submission if mail fails
                    Log::warning('Failed to send new order email: ' . $e->getMessage());
                }
            }
        }
    }
}
