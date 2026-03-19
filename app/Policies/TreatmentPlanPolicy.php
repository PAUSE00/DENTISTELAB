<?php

namespace App\Policies;

use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TreatmentPlanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'dentist' || $user->role === 'clinic_staff';
    }

    public function view(User $user, TreatmentPlan $treatmentPlan): bool
    {
        return $user->clinic_id === $treatmentPlan->clinic_id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'dentist' || $user->role === 'clinic_staff';
    }

    public function update(User $user, TreatmentPlan $treatmentPlan): bool
    {
        return $user->clinic_id === $treatmentPlan->clinic_id;
    }

    public function delete(User $user, TreatmentPlan $treatmentPlan): bool
    {
        return $user->role === 'dentist' && $user->clinic_id === $treatmentPlan->clinic_id;
    }
}
