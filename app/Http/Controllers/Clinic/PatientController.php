<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'allergies' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'blood_group' => 'nullable|string|max:5',
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
        if ($patient->clinic_id !== Auth::user()->clinic_id) {
            abort(403);
        }

        $patient->load([
            'orders.lab', 
            'orders.service', 
            'appointments.doctor', 
            'clinicalNotes.author'
        ]);

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

        // Merge all into a timeline
        /** @var \Illuminate\Support\Collection $timeline */
        $timeline = collect();

        foreach ($orders as $order) {
            $timeline->push([
                'id' => 'order-' . $order->id,
                'date' => $order->created_at,
                'type' => 'order',
                'title' => 'New Order: ' . $order->service->name,
                'status' => $order->status,
                'lab' => $order->lab->name,
                'price' => $order->final_price ?: $order->price,
            ]);
        }

        foreach ($patient->appointments as $app) {
            $timeline->push([
                'id' => 'app-' . $app->id,
                'date' => $app->start_time,
                'type' => 'appointment',
                'title' => 'Appointment: ' . $app->status,
                'doctor' => $app->doctor->name,
                'status' => $app->status,
                'notes' => $app->notes,
            ]);
        }

        foreach ($patient->clinicalNotes as $note) {
            $timeline->push([
                'id' => 'note-' . $note->id,
                'date' => $note->created_at,
                'type' => 'clinical_note',
                'title' => 'Clinical Note (' . ucfirst($note->type) . ')',
                'author' => $note->author->name,
                'content' => $note->content,
            ]);
        }

        return Inertia::render('Clinic/Patients/Show', [
            'patient' => $patient,
            'stats' => $stats,
            'timeline' => $timeline->sortByDesc('date')->values(),
        ]);
    }

    public function storeNote(Request $request, Patient $patient)
    {
        if ($patient->clinic_id !== Auth::user()->clinic_id) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:general,prescription,diagnostic',
            'content' => 'required|string',
        ]);

        $patient->clinicalNotes()->create([
            'type' => $validated['type'],
            'content' => $validated['content'],
            'author_id' => Auth::id(),
        ]);

        return back()->with('success', 'Clinical note added.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        if ($patient->clinic_id !== Auth::user()->clinic_id) {
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
        if ($patient->clinic_id !== Auth::user()->clinic_id) {
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
            'allergies' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'blood_group' => 'nullable|string|max:5',
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
        if ($patient->clinic_id !== Auth::user()->clinic_id) {
            abort(403);
        }

        $patient->delete();

        return redirect()->route('clinic.patients.index')
            ->with('success', 'Patient deleted successfully.');
    }
}
