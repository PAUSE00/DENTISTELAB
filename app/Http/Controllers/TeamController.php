<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\TeamMemberInvitationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $query = User::query();

        if ($user->role === 'lab_owner') {
            $query->where('lab_id', $user->lab_id)
                ->where('id', '!=', $user->id); // Exclude self
        } elseif ($user->role === 'dentist') {
            $query->where('clinic_id', $user->clinic_id)
                ->where('id', '!=', $user->id); // Exclude self
        } else {
            abort(403, 'Unauthorized action.');
        }

        $members = $query->latest()->get();

        // Return different views based on role, or a shared one if possible.
        // For distinct layouts/naming, specific views are better.
        if ($user->role === 'lab_owner') {
            return Inertia::render('Lab/Team/Index', [
                'members' => $members
            ]);
        } else {
            return Inertia::render('Clinic/Team/Index', [
                'members' => $members
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'phone' => 'nullable|string|max:20',
        ]);

        $role = '';
        $labId = null;
        $clinicId = null;

        if ($user->role === 'lab_owner') {
            $role = 'lab_tech'; // Default role for lab team members
            $labId = $user->lab_id;
        } elseif ($user->role === 'dentist') {
            $role = 'clinic_staff'; // Default role for clinic team members
            $clinicId = $user->clinic_id;
        } else {
            abort(403, 'Unauthorized action.');
        }

        $defaultPassword = 'password123';

        $newMember = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($defaultPassword),
            'role' => $role,
            'lab_id' => $labId,
            'clinic_id' => $clinicId,
            'is_active' => true,
        ]);

        Mail::to($newMember->email)->send(new TeamMemberInvitationMail($newMember, $defaultPassword, $user));

        return redirect()->back()->with('success', 'Team member invited successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $member)
    {
        $user = auth()->user();

        // Authorization check: User must own the entity the member belongs to
        if ($user->role === 'lab_owner' && $member->lab_id !== $user->lab_id) {
            abort(403, 'Unauthorized action.');
        }

        if ($user->role === 'dentist' && $member->clinic_id !== $user->clinic_id) {
            abort(403, 'Unauthorized action.');
        }

        $member->delete();

        return redirect()->back()->with('success', 'Team member removed successfully.');
    }
}
