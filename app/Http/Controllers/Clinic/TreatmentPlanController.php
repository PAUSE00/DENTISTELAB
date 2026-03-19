<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\TreatmentPlan;
use App\Models\TreatmentPlanStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TreatmentPlanController extends Controller
{
    public function index(Request $request)
    {
        $clinic = Auth::user()->clinic;
        $query = $clinic->treatmentPlans()->with(['patient', 'creator']);

        if ($request->filled('search')) {
            $query->whereHas('patient', function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            })->orWhere('title', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $plans = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Clinic/TreatmentPlans/Index', [
            'plans' => $plans,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(Request $request)
    {
        $patients = Auth::user()->clinic->patients()->select('id', 'first_name', 'last_name')->get();
        return Inertia::render('Clinic/TreatmentPlans/Create', [
            'patients' => $patients,
            'preselectedPatientId' => (int)$request->patient_id ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'estimated_cost' => 'nullable|numeric',
            'status' => 'required|in:draft,active,completed,cancelled',
            'steps' => 'required|array|min:1',
            'steps.*.title' => 'required|string',
            'steps.*.description' => 'nullable|string',
            'steps.*.cost' => 'nullable|numeric',
            'steps.*.sort_order' => 'required|integer',
        ]);

        return DB::transaction(function () use ($validated) {
            $clinic = Auth::user()->clinic;
            
            $plan = TreatmentPlan::create([
                'clinic_id' => $clinic->id,
                'patient_id' => $validated['patient_id'],
                'created_by' => Auth::id(),
                'title' => $validated['title'],
                'description' => $validated['description'],
                'status' => $validated['status'],
                'estimated_cost' => $validated['estimated_cost'],
            ]);

            foreach ($validated['steps'] as $stepData) {
                TreatmentPlanStep::create([
                    'treatment_plan_id' => $plan->id,
                    'title' => $stepData['title'],
                    'description' => $stepData['description'],
                    'cost' => $stepData['cost'],
                    'sort_order' => $stepData['sort_order'],
                    'status' => 'pending',
                ]);
            }

            return redirect()->route('clinic.treatment-plans.show', $plan->id)
                ->with('success', 'Treatment plan created successfully');
        });
    }

    public function show(TreatmentPlan $treatmentPlan)
    {
        $this->authorize('view', $treatmentPlan);
        $treatmentPlan->load(['patient', 'steps.order', 'creator']);
        return Inertia::render('Clinic/TreatmentPlans/Show', [
            'plan' => $treatmentPlan
        ]);
    }

    public function updateStepStatus(Request $request, TreatmentPlan $plan, TreatmentPlanStep $step)
    {
        $this->authorize('update', $plan);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,done,skipped',
        ]);

        $step->update([
            'status' => $validated['status'],
            'completed_at' => ($validated['status'] === 'done') ? now() : null,
        ]);

        return back()->with('success', 'Step status updated');
    }

    public function destroy(TreatmentPlan $treatmentPlan)
    {
        $this->authorize('delete', $treatmentPlan);
        $treatmentPlan->delete();
        return redirect()->route('clinic.treatment-plans.index')->with('success', 'Plan deleted');
    }
}
