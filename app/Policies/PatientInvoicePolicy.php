<?php

namespace App\Policies;

use App\Models\PatientInvoice;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PatientInvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'dentist' || $user->role === 'clinic_staff';
    }

    public function view(User $user, PatientInvoice $patientInvoice): bool
    {
        return $user->clinic_id === $patientInvoice->clinic_id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'dentist' || $user->role === 'clinic_staff';
    }

    public function update(User $user, PatientInvoice $patientInvoice): bool
    {
        return $user->clinic_id === $patientInvoice->clinic_id;
    }

    public function delete(User $user, PatientInvoice $patientInvoice): bool
    {
        return $user->role === 'dentist' && $user->clinic_id === $patientInvoice->clinic_id;
    }
}
