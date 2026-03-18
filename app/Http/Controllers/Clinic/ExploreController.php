<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $labs = Lab::withCount('services')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($lab) {
                // Mock some data for the marketplace feel
                $lab->rating = 4.5 + (rand(0, 5) / 10);
                $lab->order_count = rand(100, 1000);
                return $lab;
            });

        return Inertia::render('Clinic/Explore/Index', [
            'labs' => $labs,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Lab $lab)
    {
        $lab->load('services');
        
        // Mock data
        $lab->rating = 4.8;
        $lab->delivery_speed = '48h avg';
        $lab->specialties = ['Zirconia', 'Implantology', 'Orthodontics'];

        return Inertia::render('Clinic/Explore/LabProfile', [
            'lab' => $lab,
        ]);
    }
}
