<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('lab_id', Auth::user()->lab_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Lab/Services/Index', [
            'services' => $services
        ]);
    }

    public function create()
    {
        return Inertia::render('Lab/Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'production_days' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $validated['lab_id'] = Auth::user()->lab_id;

        Service::create($validated);

        return redirect()->route('lab.services.index')
            ->with('message', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        // Ensure user belongs to the lab
        if ($service->lab_id !== Auth::user()->lab_id) {
            abort(403);
        }

        return Inertia::render('Lab/Services/Edit', [
            'service' => $service
        ]);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->lab_id !== Auth::user()->lab_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'production_days' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $service->update($validated);

        return redirect()->route('lab.services.index')
            ->with('message', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        if ($service->lab_id !== Auth::user()->lab_id) {
            abort(403);
        }

        // We could just deactivate it, but let's allow deletion for now
        // if it's not tied to any orders (cascade might handle it or error)
        $service->delete();

        return redirect()->route('lab.services.index')
            ->with('message', 'Service deleted successfully.');
    }
}
