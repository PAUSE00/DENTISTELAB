<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $labId = Auth::user()->lab_id;
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());
        $dateRange = [$startDate . ' 00:00:00', $endDate . ' 23:59:59'];

        // 1. Status Counts (period)
        $statusCounts = Order::where('lab_id', $labId)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // 2. Revenue
        $totalRevenue = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->sum(DB::raw('COALESCE(final_price, price)')) ?? 0;

        $periodRevenue = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->whereBetween('created_at', $dateRange)
            ->sum(DB::raw('COALESCE(final_price, price)')) ?? 0;

        // 3. Daily chart data
        $chartData = [];
        $period = \Carbon\CarbonPeriod::create($startDate, $endDate);
        $dailyOrders = Order::where('lab_id', $labId)
            ->whereBetween('created_at', $dateRange)
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

        // 4. Top services
        $topServices = Order::where('orders.lab_id', $labId)
            ->whereBetween('orders.created_at', $dateRange)
            ->join('services', 'orders.service_id', '=', 'services.id')
            ->selectRaw('services.name, services.id, count(orders.id) as order_count, SUM(COALESCE(orders.final_price, orders.price)) as revenue')
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('order_count')
            ->limit(5)
            ->get()
            ->toArray();

        // 5. Client breakdown
        $clientBreakdown = Order::where('orders.lab_id', $labId)
            ->whereBetween('orders.created_at', $dateRange)
            ->join('clinics', 'orders.clinic_id', '=', 'clinics.id')
            ->selectRaw('clinics.name, clinics.id, count(orders.id) as order_count, SUM(COALESCE(orders.final_price, orders.price)) as revenue')
            ->groupBy('clinics.id', 'clinics.name')
            ->orderByDesc('order_count')
            ->get()
            ->toArray();

        // 6. Payment breakdown
        $paymentBreakdown = Order::where('lab_id', $labId)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('payment_status, count(*) as count, SUM(COALESCE(final_price, price)) as total')
            ->groupBy('payment_status')
            ->pluck('count', 'payment_status')
            ->toArray();

        $paymentRevenueBreakdown = Order::where('lab_id', $labId)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('payment_status, SUM(COALESCE(final_price, price)) as total')
            ->groupBy('payment_status')
            ->pluck('total', 'payment_status')
            ->toArray();

        // 7. Monthly trend (last 6 months)
        $monthlyTrend = Order::where('lab_id', $labId)
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, count(*) as orders, SUM(COALESCE(final_price, price)) as revenue")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();

        // 8. Production metrics
        $totalActive = Order::where('lab_id', $labId)
            ->whereNotIn('status', [OrderStatus::Delivered->value, OrderStatus::Archived->value, OrderStatus::Rejected->value, OrderStatus::Cancelled->value])
            ->count();

        $overdueCount = Order::where('lab_id', $labId)
            ->whereNotIn('status', [OrderStatus::Delivered->value, OrderStatus::Archived->value, OrderStatus::Rejected->value, OrderStatus::Cancelled->value])
            ->where('due_date', '<', now())
            ->count();

        $avgTurnaroundDays = Order::where('lab_id', $labId)
            ->where('status', OrderStatus::Delivered->value)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
            ->value('avg_days') ?? 0;

        $periodOrderCount = Order::where('lab_id', $labId)
            ->whereBetween('created_at', $dateRange)
            ->count();

        return Inertia::render('Lab/Analytics/Index', [
            'stats' => [
                'statusCounts' => $statusCounts,
                'totalRevenue' => $totalRevenue,
                'periodRevenue' => $periodRevenue,
                'chartData' => $chartData,
                'topServices' => $topServices,
                'clientBreakdown' => $clientBreakdown,
                'paymentBreakdown' => $paymentBreakdown,
                'paymentRevenueBreakdown' => $paymentRevenueBreakdown,
                'monthlyTrend' => $monthlyTrend,
                'totalActive' => $totalActive,
                'overdueCount' => $overdueCount,
                'avgTurnaroundDays' => round($avgTurnaroundDays, 1),
                'periodOrderCount' => $periodOrderCount,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
