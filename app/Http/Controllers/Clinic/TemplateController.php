<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\OrderTemplate;
use App\Models\Lab;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $clinic = $user->clinic;
        
        $templates = OrderTemplate::with(['lab', 'service'])
            ->where('clinic_id', $clinic->id)
            ->latest()
            ->get();

        $labs = Lab::whereHas('clinics', function($q) use ($clinic) {
            $q->where('clinic_id', $clinic->id);
        })->get();

        return Inertia::render('Clinic/Templates/Index', [
            'templates' => $templates,
            'labs' => $labs,
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $clinic = $user->clinic;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lab_id' => 'nullable|exists:labs,id',
            'service_id' => 'nullable|exists:services,id',
            'teeth_data' => 'nullable|array',
            'notes' => 'nullable|string',
            'color' => 'required|string|size:7',
        ]);

        OrderTemplate::create([
            'clinic_id' => $clinic->id,
            ...$validated
        ]);

        return back()->with('success', 'Template created successfully');
    }

    public function update(Request $request, OrderTemplate $template)
    {
        if ($template->clinic_id !== Auth::user()->clinic_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lab_id' => 'nullable|exists:labs,id',
            'service_id' => 'nullable|exists:services,id',
            'teeth_data' => 'nullable|array',
            'notes' => 'nullable|string',
            'color' => 'required|string|size:7',
        ]);

        $template->update($validated);

        return back()->with('success', 'Template updated successfully');
    }

    public function destroy(OrderTemplate $template)
    {
        if ($template->clinic_id !== Auth::user()->clinic_id) {
            abort(403);
        }

        $template->delete();

        return back()->with('success', 'Template deleted successfully');
    }
}
