<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $clinicId = $request->user()->clinic_id;
        
        $appointments = Appointment::with(['patient', 'doctor'])
            ->where('clinic_id', $clinicId)
            ->latest()
            ->get();

        $patients = Patient::where('clinic_id', $clinicId)
            ->select('id', 'first_name', 'last_name')
            ->get();

        $doctors = User::where('clinic_id', $clinicId)
            ->whereIn('role', ['dentist', 'clinic_staff'])
            ->select('id', 'name')
            ->get();

        return Inertia::render('Clinic/Appointments/Index', [
            'appointments' => $appointments,
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'required|string|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $request->user()->clinic->appointments()->create($validated);

        return redirect()->back()->with('success', 'Appointment created successfully.');
    }

    public function update(Request $request, Appointment $appointment)
    {
        if ($appointment->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $validated = $request->validate([
            'patient_id' => 'sometimes|required|exists:patients,id',
            'doctor_id' => 'sometimes|required|exists:users,id',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'status' => 'sometimes|required|string|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return redirect()->back()->with('success', 'Appointment updated successfully.');
    }

    public function destroy(Appointment $appointment)
    {
        if ($appointment->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $appointment->delete();

        return redirect()->back()->with('success', 'Appointment deleted successfully.');
    }
}
