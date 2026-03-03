<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_clinics' => \App\Models\Clinic::count(),
            'total_labs' => \App\Models\Lab::count(),
            'total_orders' => \App\Models\Order::count(),
            'total_revenue' => \App\Models\Order::whereIn('status', ['delivered', 'archived'])->sum('price'),
            'mrr' => \App\Models\Order::whereIn('status', ['delivered', 'archived'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('price'),
        ];

        // Ensure we handle MySQL date formatting properly
        $trendDates = collect();
        for ($i = 29; $i >= 0; $i--) {
            $trendDates->push(now()->subDays($i)->format('Y-m-d'));
        }

        $orderCounts = \App\Models\Order::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $orderVolumeTrend = $trendDates->map(function ($date) use ($orderCounts) {
            return [
                'date' => \Carbon\Carbon::parse($date)->format('M d'),
                'orders' => $orderCounts[$date] ?? 0,
            ];
        });

        $recentUsers = \App\Models\User::with(['clinic', 'lab'])->latest()->limit(5)->get();
        $recentOrders = \App\Models\Order::with(['clinic', 'lab', 'patient'])->latest()->limit(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'orderVolumeTrend' => $orderVolumeTrend,
            'recentUsers' => $recentUsers,
            'recentOrders' => $recentOrders,
        ]);
    }
}
