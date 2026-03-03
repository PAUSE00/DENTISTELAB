<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $clinic = Auth::user()->clinic;

        return Inertia::render('Clinic/Settings/Index', [
            'clinic' => $clinic,
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|image|max:2048', // 2MB max
        ]);

        $clinic = Auth::user()->clinic;

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($clinic->logo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($clinic->logo_path);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo_path'] = $path;
        }

        $clinic->update($validated);

        return redirect()->back()->with('success', 'Paramètres mis à jour avec succès.');
    }
}
