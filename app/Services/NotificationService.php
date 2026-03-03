<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Order;
use App\Models\User;
use App\Events\OrderSubmitted;
use App\Events\OrderStatusUpdated;
use App\Events\NotificationCreated;

class NotificationService
{

    /**
     * Create a notification when a new message is received in chat.
     */
    public static function newMessage(Order $order, User $sender): void
    {
        // Find the other party
        if (in_array($sender->role, ['dentist', 'clinic_staff'])) {
            $recipients = User::where('lab_id', $order->lab_id)->get();
        } else {
            $recipients = User::where('clinic_id', $order->clinic_id)->get();
        }

        foreach ($recipients as $user) {
            if ($user->id === $sender->id) {
                continue;
            }

            $notification = Notification::create([
                'user_id' => $user->id,
                'type' => 'new_message',
                'title' => 'Nouveau message',
                'body' => "Message de {$sender->name} sur la commande #{$order->id}",
                'data' => [
                    'order_id' => $order->id,
                    'sender_name' => $sender->name,
                ],
            ]);

            event(new NotificationCreated($notification));
        }
    }

    /**
     * Create a notification when a clinic invitation is accepted.
     */
    public static function invitationAccepted(string $labId, string $clinicName): void
    {
        $labUsers = User::where('lab_id', $labId)->get();

        foreach ($labUsers as $user) {
            $notification = Notification::create([
                'user_id' => $user->id,
                'type' => 'invitation_accepted',
                'title' => 'Invitation acceptée',
                'body' => "{$clinicName} a rejoint votre réseau",
                'data' => ['clinic_name' => $clinicName],
            ]);

            event(new NotificationCreated($notification));
        }
    }

    /**
     * Create a notification when a clinic receives an invitation (in-app).
     */
    public static function invitationReceived(string $clinicId, string $labName): void
    {
        $clinicUsers = User::where('clinic_id', $clinicId)->get();

        foreach ($clinicUsers as $user) {
            $notification = Notification::create([
                'user_id' => $user->id,
                'type' => 'invitation_received',
                'title' => 'Nouvelle invitation',
                'body' => "Le laboratoire {$labName} vous a invité",
                'data' => ['lab_name' => $labName],
            ]);

            event(new NotificationCreated($notification));
        }
    }
}
