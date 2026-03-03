<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    $order = \App\Models\Order::find($orderId);

    if (!$order) {
        return false;
    }

    if ($user->role === 'super_admin') {
        return true;
    }

    if (in_array($user->role, ['dentist', 'clinic_staff'])) {
        return $user->clinic_id === $order->clinic_id;
    }

    if (in_array($user->role, ['lab_owner', 'lab_tech'])) {
        return $user->lab_id === $order->lab_id;
    }

    return false;
});

Broadcast::channel('lab.{labId}', function ($user, $labId) {
    return in_array($user->role, ['lab_owner', 'lab_tech']) && (int) $user->lab_id === (int) $labId;
});

Broadcast::channel('clinic.{clinicId}', function ($user, $clinicId) {
    return in_array($user->role, ['dentist', 'clinic_staff']) && (int) $user->clinic_id === (int) $clinicId;
});
