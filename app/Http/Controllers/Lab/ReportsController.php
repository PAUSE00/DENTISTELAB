<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index()
    {
        $labId = Auth::user()->lab_id;
        $now   = Carbon::now();

        // ── Monthly revenue trend (last 12 months) ──────────────────
        $monthlyRevenue = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->where('created_at', '>=', $now->copy()->subMonths(11)->startOfMonth())
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month,
                         COUNT(*) as orders,
                         SUM(COALESCE(final_price, price)) as revenue")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'   => Carbon::createFromFormat('Y-m', $r->month)->format('M Y'),
                'orders'  => (int) $r->orders,
                'revenue' => (float) $r->revenue,
            ]);

        // ── Top services (all time) ──────────────────────────────────
        $topServices = Order::where('orders.lab_id', $labId)
            ->join('services', 'orders.service_id', '=', 'services.id')
            ->selectRaw("services.name,
                         COUNT(orders.id) as order_count,
                         SUM(COALESCE(orders.final_price, orders.price)) as revenue,
                         ROUND(AVG(COALESCE(orders.final_price, orders.price)), 2) as avg_price")
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('order_count')
            ->limit(8)
            ->get();

        // ── Top clients ──────────────────────────────────────────────
        $topClients = Order::where('orders.lab_id', $labId)
            ->join('clinics', 'orders.clinic_id', '=', 'clinics.id')
            ->selectRaw("clinics.name,
                         COUNT(orders.id) as order_count,
                         SUM(COALESCE(orders.final_price, orders.price)) as revenue")
            ->groupBy('clinics.id', 'clinics.name')
            ->orderByDesc('order_count')
            ->limit(8)
            ->get();

        // ── Avg turnaround per month (last 6 months) ─────────────────
        $turnaround = Order::where('lab_id', $labId)
            ->where('status', OrderStatus::Delivered->value)
            ->where('updated_at', '>=', $now->copy()->subMonths(5)->startOfMonth())
            ->selectRaw("DATE_FORMAT(updated_at, '%Y-%m') as month,
                         ROUND(AVG(DATEDIFF(updated_at, created_at)), 1) as avg_days,
                         COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'    => Carbon::createFromFormat('Y-m', $r->month)->format('M Y'),
                'avg_days' => (float) $r->avg_days,
                'count'    => (int) $r->count,
            ]);

        // ── KPI summary ───────────────────────────────────────────────
        $totalOrders   = Order::where('lab_id', $labId)->count();
        $totalRevenue  = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->sum(DB::raw('COALESCE(final_price, price)'));
        $thisMonth     = Order::where('lab_id', $labId)
            ->whereYear('created_at', $now->year)->whereMonth('created_at', $now->month)->count();
        $thisMonthRev  = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->whereYear('created_at', $now->year)->whereMonth('created_at', $now->month)
            ->sum(DB::raw('COALESCE(final_price, price)'));
        $overdueCount  = Order::where('lab_id', $labId)
            ->whereNotIn('status', [OrderStatus::Delivered->value, OrderStatus::Archived->value, OrderStatus::Rejected->value, OrderStatus::Cancelled->value])
            ->where('due_date', '<', $now)->count();
        $avgTurnaround = Order::where('lab_id', $labId)
            ->where('status', OrderStatus::Delivered->value)
            ->selectRaw('ROUND(AVG(DATEDIFF(updated_at, created_at)), 1) as avg_days')
            ->value('avg_days') ?? 0;

        // ── Order status distribution ─────────────────────────────────
        $statusDist = Order::where('lab_id', $labId)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Lab/Reports', [
            'monthlyRevenue' => $monthlyRevenue,
            'topServices'    => $topServices,
            'topClients'     => $topClients,
            'turnaround'     => $turnaround,
            'statusDist'     => $statusDist,
            'kpi'            => [
                'totalOrders'   => $totalOrders,
                'totalRevenue'  => (float) $totalRevenue,
                'thisMonth'     => $thisMonth,
                'thisMonthRev'  => (float) $thisMonthRev,
                'overdueCount'  => $overdueCount,
                'avgTurnaround' => (float) $avgTurnaround,
            ],
        ]);
    }
}
