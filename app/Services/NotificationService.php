<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Notify a user.
     */
    public static function notifyUser(int $userId, string $type, string $title, string $body, array $data = []): Notification
    {
        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);

        \App\Events\NotificationCreated::dispatch($notification);

        return $notification;
    }

    /**
     * Notify all users with specific roles in a clinic.
     */
    public static function notifyClinic(int $clinicId, string $type, string $title, string $body, array $data = []): void
    {
        $users = User::where('clinic_id', $clinicId)
            ->whereIn('role', ['dentist', 'clinic_staff'])
            ->get();

        foreach ($users as $user) {
            self::notifyUser($user->id, $type, $title, $body, $data);
        }
    }

    /**
     * Notify all users with specific roles in a lab.
     */
    public static function notifyLab(int $labId, string $type, string $title, string $body, array $data = []): void
    {
        $users = User::where('lab_id', $labId)
            ->whereIn('role', ['lab_owner', 'lab_tech'])
            ->get();

        foreach ($users as $user) {
            self::notifyUser($user->id, $type, $title, $body, $data);
        }
    }
    /**
     * Notify about a new message.
     */
    public static function newMessage(\App\Models\Order $order, \App\Models\User $sender): void
    {
        $title = "New Message: Order #{$order->id}";
        $body = "{$sender->name} sent a new message.";
        $data = ['order_id' => $order->id, 'action' => 'chat'];

        if (in_array($sender->role, ['dentist', 'clinic_staff'])) {
            self::notifyLab($order->lab_id, 'info', $title, $body, $data);
        } else {
            self::notifyClinic($order->clinic_id, 'info', $title, $body, $data);
        }
    }
}
