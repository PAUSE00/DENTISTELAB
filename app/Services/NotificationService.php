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
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);
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
}
