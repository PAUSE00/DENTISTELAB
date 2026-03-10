<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Patient::query()
            ->where('clinic_id', $request->user()->clinic_id);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $patients = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Clinic/Patients/Index', [
            'patients' => $patients,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clinic/Patients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'external_id' => 'nullable|string|max:50',
            'medical_notes' => 'nullable|string',
        ]);

        $request->user()->clinic->patients()->create($validated);

        return redirect()->route('clinic.patients.index')
            ->with('success', 'Patient created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        // Ensure the patient belongs to the user's clinic
        if ($patient->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $patient->load('orders.lab', 'orders.service', 'orders.history.user');

        // Compute stats
        $orders = $patient->orders;
        $stats = [
            'total_orders' => $orders->count(),
            'total_spent' => $orders->sum('final_price'),
            'completed' => $orders->whereIn('status', ['delivered', 'finished', 'archived'])->count(),
            'in_progress' => $orders->whereIn('status', ['in_progress', 'fitting'])->count(),
            'pending' => $orders->where('status', 'new')->count(),
            'cancelled' => $orders->whereIn('status', ['cancelled', 'rejected'])->count(),
        ];

        return Inertia::render('Clinic/Patients/Show', [
            'patient' => $patient,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        if ($patient->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        return Inertia::render('Clinic/Patients/Edit', [
            'patient' => $patient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        if ($patient->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'external_id' => 'nullable|string|max:50',
            'medical_notes' => 'nullable|string',
        ]);

        $patient->update($validated);

        return redirect()->route('clinic.patients.index')
            ->with('success', 'Patient updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        if ($patient->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $patient->delete();

        return redirect()->route('clinic.patients.index')
            ->with('success', 'Patient deleted successfully.');
    }
}
