<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $labId = Auth::user()->lab_id;
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        // 1. Order Status Counts (filtered by date)
        $statusCounts = Order::where('lab_id', $labId)
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // 2. Revenue (Overall and Period)
        $totalRevenue = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->sum(\Illuminate\Support\Facades\DB::raw('COALESCE(final_price, price)')) ?? 0;

        $monthlyRevenue = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum(\Illuminate\Support\Facades\DB::raw('COALESCE(final_price, price)')) ?? 0;

        // 3. Chart Data (Daily volume in period)
        // If range is > 31 days, maybe group by week/month? For now, keep simple daily.
        $chartData = [];
        $period = \Carbon\CarbonPeriod::create($startDate, $endDate);

        // Optimizing chart query: fetch all in range, then map
        $dailyOrders = Order::where('lab_id', $labId)
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('DATE(created_at) as date, count(*) as count, SUM(COALESCE(final_price, price)) as revenue')
            ->groupBy('date')
            ->get()
            ->keyBy('date')
            ->toArray();

        foreach ($period as $date) {
            $formattedDate = $date->format('Y-m-d');
            $chartData[] = [
                'name' => $date->format('d/m'),
                'orders' => $dailyOrders[$formattedDate]['count'] ?? 0,
                'revenue' => $dailyOrders[$formattedDate]['revenue'] ?? 0,
            ];
        }

        return Inertia::render('Lab/Dashboard', [
            'stats' => [
                'statusCounts' => $statusCounts,
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'chartData' => $chartData,
                'pendingOrders' => $statusCounts[OrderStatus::New->value] ?? 0,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
