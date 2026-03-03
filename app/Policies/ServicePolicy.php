<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    /**
     * Determine if the user can view any services.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['lab_owner', 'super_admin']);
    }

    /**
     * Determine if the user can view the service.
     */
    public function view(User $user, Service $service): bool
    {
        return match ($user->role) {
            'lab_owner' => $service->lab_id === $user->lab_id,
            'super_admin' => true,
            default => false,
        };
    }

    /**
     * Determine if the user can create services.
     */
    public function create(User $user): bool
    {
        return $user->role === 'lab_owner';
    }

    /**
     * Determine if the user can update the service.
     */
    public function update(User $user, Service $service): bool
    {
        return $this->view($user, $service);
    }

    /**
     * Determine if the user can delete the service.
     */
    public function delete(User $user, Service $service): bool
    {
        return $this->view($user, $service);
    }
}
