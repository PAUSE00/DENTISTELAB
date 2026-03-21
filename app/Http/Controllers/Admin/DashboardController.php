<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();
        $thisMonthStart = $now->copy()->startOfMonth();

        // Revenue calculations
        $totalRevenueThisMonth = \App\Models\Order::whereIn('status', ['delivered', 'archived'])
            ->where('created_at', '>=', $thisMonthStart)->sum('price');
            
        $totalRevenueLastMonth = \App\Models\Order::whereIn('status', ['delivered', 'archived'])
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->sum('price');
            
        $revenueGrowth = $totalRevenueLastMonth > 0 
            ? (($totalRevenueThisMonth - $totalRevenueLastMonth) / $totalRevenueLastMonth) * 100 
            : 0;

        // Count calculations
        $labsThisMonth = \App\Models\Lab::where('created_at', '>=', $thisMonthStart)->count();
        $clinicsThisMonth = \App\Models\Clinic::where('created_at', '>=', $thisMonthStart)->count();
        $ordersThisMonth = \App\Models\Order::where('created_at', '>=', $thisMonthStart)->count();

        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_clinics' => \App\Models\Clinic::count(),
            'total_labs' => \App\Models\Lab::count(),
            'total_orders' => \App\Models\Order::count(),
            'total_revenue' => \App\Models\Order::whereIn('status', ['delivered', 'archived'])->sum('price'),
            'mrr' => $totalRevenueThisMonth,
            'growths' => [
                'revenue' => round($revenueGrowth, 1),
                'mrr' => round($revenueGrowth, 1),
                'labs_clinics' => $labsThisMonth + $clinicsThisMonth,
                'orders' => $ordersThisMonth
            ]
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
