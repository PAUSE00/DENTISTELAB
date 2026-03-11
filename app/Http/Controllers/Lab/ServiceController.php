<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceController extends Controller
{
    private const CATEGORIES = [
        'Fixed Prosthetics',
        'Removable Prosthetics',
        'Implantology',
        'Orthodontics',
        'Temporaries',
        'Other',
    ];

    public function index()
    {
        $services = Service::where('lab_id', Auth::user()->lab_id)
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(fn($s) => [
                'id'              => $s->id,
                'name'            => $s->name,
                'description'     => $s->description,
                'price'           => $s->price,
                'production_days' => $s->production_days,
                'is_active'       => $s->is_active,
                'category'        => $s->category ?? 'Fixed Prosthetics',
                'image_url'       => $s->image ? Storage::url($s->image) : null,
            ]);

        return Inertia::render('Lab/Services/Index', [
            'services'   => $services,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function create()
    {
        return Inertia::render('Lab/Services/Create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'production_days' => 'required|integer|min:1',
            'is_active'       => 'boolean',
            'category'        => 'required|string|in:' . implode(',', self::CATEGORIES),
            'image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $validated['lab_id'] = Auth::user()->lab_id;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        Service::create($validated);

        return redirect()->route('lab.services.index')
            ->with('message', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        if ($service->lab_id !== Auth::user()->lab_id) {
            abort(403);
        }

        return Inertia::render('Lab/Services/Edit', [
            'service' => [
                'id'              => $service->id,
                'name'            => $service->name,
                'description'     => $service->description,
                'price'           => $service->price,
                'production_days' => $service->production_days,
                'is_active'       => $service->is_active,
                'category'        => $service->category ?? 'Fixed Prosthetics',
                'image_url'       => $service->image ? Storage::url($service->image) : null,
            ],
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->lab_id !== Auth::user()->lab_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'production_days' => 'required|integer|min:1',
            'is_active'       => 'boolean',
            'category'        => 'required|string|in:' . implode(',', self::CATEGORIES),
            'image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image from storage
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        // Allow removing image
        if ($request->boolean('remove_image') && $service->image) {
            Storage::disk('public')->delete($service->image);
            $validated['image'] = null;
        }

        $service->update($validated);

        return redirect()->route('lab.services.index')
            ->with('message', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        if ($service->lab_id !== Auth::user()->lab_id) {
            abort(403);
        }

        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        return redirect()->route('lab.services.index')
            ->with('message', 'Service deleted successfully.');
    }
}
