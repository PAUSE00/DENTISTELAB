<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $lab = Lab::findOrFail(Auth::user()->lab_id);

        return Inertia::render('Lab/Settings/Index', [
            'lab' => $lab,
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'terms' => 'nullable|string',
            'logo' => 'nullable|image|max:2048', // 2MB max
        ]);

        $lab = Lab::findOrFail(Auth::user()->lab_id);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($lab->logo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($lab->logo_path);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo_path'] = $path;
        }

        $lab->update($validated);

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
