<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Clinic;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ClinicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Clinic::query()->with(['owner', 'labs']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%")
                ->orWhereHas('owner', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $clinics = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Clinics/Index', [
            'clinics' => $clinics,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get dentists who don't have a clinic yet
        $availableDentists = User::where('role', 'dentist')
            ->whereNull('clinic_id')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Clinics/Create', [
            'dentists' => $availableDentists,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'manager_name' => 'nullable|string|max:255',
            'dentist_id' => 'required|exists:users,id',
        ]);

        $clinic = Clinic::create([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'manager_name' => $request->manager_name,
        ]);

        // Link the clinic to the owner (dentist)
        $dentist = User::find($request->dentist_id);
        $dentist->clinic_id = $clinic->id;
        $dentist->save();

        \App\Services\AuditLogger::log('Clinic Created', "Admin created clinic {$clinic->name}");

        return redirect()->route('admin.clinics.index')->with('success', 'Clinic created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Clinic $clinic)
    {
        // Get current owner and other available dentists
        $currentOwner = $clinic->owner; // using the relationship I assume exists on Clinic model: public function owner() { return $this->hasOne(User::class, 'clinic_id'); }

        $availableDentists = User::where('role', 'dentist')
            ->where(function ($q) use ($clinic) {
                $q->whereNull('clinic_id')
                    ->orWhere('clinic_id', $clinic->id);
            })
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Clinics/Edit', [
            'clinic' => $clinic,
            'current_owner_id' => $currentOwner ? $currentOwner->id : null,
            'dentists' => $availableDentists,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Clinic $clinic)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'manager_name' => 'nullable|string|max:255',
            'dentist_id' => 'required|exists:users,id',
        ]);

        $clinic->update([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'manager_name' => $request->manager_name,
        ]);

        // Check if owner changed
        $currentOwner = $clinic->owner;
        if (!$currentOwner || $currentOwner->id != $request->dentist_id) {
            // Unlink old owner if exists
            if ($currentOwner) {
                $currentOwner->clinic_id = null;
                $currentOwner->save();
            }

            // Link new owner
            $newOwner = User::find($request->dentist_id);
            $newOwner->clinic_id = $clinic->id;
            $newOwner->save();
        }

        \App\Services\AuditLogger::log('Clinic Updated', "Admin updated clinic {$clinic->name}");

        return redirect()->route('admin.clinics.index')->with('success', 'Clinic updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Clinic $clinic)
    {
        // Unlink users first
        User::where('clinic_id', $clinic->id)->update(['clinic_id' => null]);

        $name = $clinic->name;
        $clinic->delete();

        \App\Services\AuditLogger::log('Clinic Deleted', "Admin deleted clinic {$name}");

        return redirect()->route('admin.clinics.index')->with('success', 'Clinic deleted successfully.');
    }

    /**
     * Toggle the active status of the clinic.
     */
    public function toggleActive(Clinic $clinic)
    {
        $clinic->update(['is_active' => !$clinic->is_active]);

        $status = $clinic->is_active ? 'activated' : 'deactivated';
        \App\Services\AuditLogger::log('Clinic Status Changed', "Admin {$status} clinic {$clinic->name}");

        return back()->with('success', 'Clinic status updated successfully.');
    }
}
