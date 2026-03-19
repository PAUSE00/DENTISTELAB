<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $query = InventoryItem::where('clinic_id', $clinic->id);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('supplier', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        $items = $query->latest()->get();

        // Stats use the FULL unfiltered set for accurate KPIs
        $allItems = InventoryItem::where('clinic_id', $clinic->id)->get();

        $stats = [
            'total_items'      => $allItems->count(),
            'low_stock'        => $allItems->filter(fn($i) => $i->quantity <= $i->min_threshold)->count(),
            'categories'       => $allItems->pluck('category')->unique()->filter()->values(),
            'inventory_value'  => (float) $allItems->sum(fn($i) => $i->quantity * ($i->price_per_unit ?? 0)),
        ];

        return Inertia::render('Clinic/Inventory/Index', [
            'items'   => $items,
            'stats'   => $stats,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'category'       => 'nullable|string|max:100',
            'quantity'       => 'required|numeric|min:0',
            'unit'           => 'required|string|max:20',
            'min_threshold'  => 'required|numeric|min:0',
            'supplier'       => 'nullable|string|max:255',
            'price_per_unit' => 'nullable|numeric|min:0',
        ]);

        Auth::user()->clinic->inventoryItems()->create($validated);

        return redirect()->back()->with('success', 'Item added to inventory.');
    }

    public function update(Request $request, InventoryItem $item)
    {
        if ($item->clinic_id !== Auth::user()->clinic_id) abort(403);

        $validated = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'category'       => 'sometimes|nullable|string|max:100',
            'quantity'       => 'sometimes|required|numeric|min:0',
            'unit'           => 'sometimes|required|string|max:20',
            'min_threshold'  => 'sometimes|required|numeric|min:0',
            'supplier'       => 'sometimes|nullable|string|max:255',
            'price_per_unit' => 'sometimes|nullable|numeric|min:0',
        ]);

        $item->update($validated);

        return redirect()->back()->with('success', 'Inventory updated.');
    }

    public function destroy(InventoryItem $item)
    {
        if ($item->clinic_id !== Auth::user()->clinic_id) abort(403);
        $item->delete();
        return redirect()->back()->with('success', 'Item removed.');
    }
}
