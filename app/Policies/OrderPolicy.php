<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Lists are filtered by scope in controllers
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }

        if ($user->role === 'lab_owner' || $user->role === 'lab_tech') {
            return $user->lab_id === $order->lab_id;
        }

        if ($user->role === 'dentist' || $user->role === 'clinic_staff') {
            return $user->clinic_id === $order->clinic_id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'dentist' || $user->role === 'clinic_staff';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        // Labs can update status/price/files
        if ($user->role === 'lab_owner' || $user->role === 'lab_tech') {
            return $user->lab_id === $order->lab_id;
        }

        // Dentists can update if pending (usually)
        if ($user->role === 'dentist' || $user->role === 'clinic_staff') {
            return $user->clinic_id === $order->clinic_id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order): bool
    {
        return false; // Soft delete only, usually restricted
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Order $order): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        return false;
    }
}
