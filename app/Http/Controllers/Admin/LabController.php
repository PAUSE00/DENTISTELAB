<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Lab;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class LabController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Lab::query()->with(['owner', 'clinics']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%")
                ->orWhereHas('owner', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $labs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Labs/Index', [
            'labs' => $labs,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get lab owners who don't have a lab yet
        $availableOwners = User::where('role', 'lab_owner')
            ->whereNull('lab_id')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Labs/Create', [
            'owners' => $availableOwners,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'owner_id' => 'required|exists:users,id',
        ]);

        $lab = Lab::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'is_active' => true,
        ]);

        // Link the lab to the owner
        $owner = User::find($request->owner_id);
        $owner->lab_id = $lab->id;
        $owner->save();

        return redirect()->route('admin.labs.index')->with('success', 'Lab created successfully.');
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
    public function edit(Lab $lab)
    {
        // Get current owner and other available lab owners
        $currentOwner = $lab->owner;

        $availableOwners = User::where('role', 'lab_owner')
            ->where(function ($q) use ($lab) {
                $q->whereNull('lab_id')
                    ->orWhere('lab_id', $lab->id);
            })
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Labs/Edit', [
            'lab' => $lab,
            'current_owner_id' => $currentOwner ? $currentOwner->id : null,
            'owners' => $availableOwners,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lab $lab)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'owner_id' => 'required|exists:users,id',
            'is_active' => 'boolean',
        ]);

        $lab->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'is_active' => $request->is_active,
        ]);

        // Check if owner changed
        $currentOwner = $lab->owner;
        if (!$currentOwner || $currentOwner->id != $request->owner_id) {
            // Unlink old owner if exists
            if ($currentOwner) {
                $currentOwner->lab_id = null;
                $currentOwner->save();
            }

            // Link new owner
            $newOwner = User::find($request->owner_id);
            $newOwner->lab_id = $lab->id;
            $newOwner->save();
        }

        return redirect()->route('admin.labs.index')->with('success', 'Lab updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lab $lab)
    {
        // Unlink users first
        User::where('lab_id', $lab->id)->update(['lab_id' => null]);

        $lab->delete();

        return redirect()->route('admin.labs.index')->with('success', 'Lab deleted successfully.');
    }

    /**
     * Toggle the active status of the lab.
     */
    public function toggleActive(Lab $lab)
    {
        $lab->update(['is_active' => !$lab->is_active]);

        return back()->with('success', 'Lab status updated successfully.');
    }
}
