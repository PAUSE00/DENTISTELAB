<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;

class PatientPolicy
{
    /**
     * Determine if the user can view any patients (list page).
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['dentist', 'clinic_staff', 'super_admin']);
    }

    /**
     * Determine if the user can view the patient.
     */
    public function view(User $user, Patient $patient): bool
    {
        return match ($user->role) {
            'dentist', 'clinic_staff' => $patient->clinic_id === $user->clinic_id,
            'super_admin' => true,
            default => false,
        };
    }

    /**
     * Determine if the user can create patients.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['dentist', 'clinic_staff']);
    }

    /**
     * Determine if the user can update the patient.
     */
    public function update(User $user, Patient $patient): bool
    {
        return $this->view($user, $patient);
    }

    /**
     * Determine if the user can delete the patient.
     */
    public function delete(User $user, Patient $patient): bool
    {
        return $this->view($user, $patient);
    }
}
