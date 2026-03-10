<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $labId = Auth::user()->lab_id;

        // Quick summary stats
        $totalActive = Order::where('lab_id', $labId)
            ->whereNotIn('status', [
                OrderStatus::Delivered->value,
                OrderStatus::Archived->value,
                OrderStatus::Rejected->value,
                OrderStatus::Cancelled->value,
            ])
            ->count();

        $pendingNew = Order::where('lab_id', $labId)
            ->where('status', OrderStatus::New->value)
            ->count();

        $overdueCount = Order::where('lab_id', $labId)
            ->whereNotIn('status', [
                OrderStatus::Delivered->value,
                OrderStatus::Archived->value,
                OrderStatus::Rejected->value,
                OrderStatus::Cancelled->value,
            ])
            ->where('due_date', '<', now())
            ->count();

        $dueTodayCount = Order::where('lab_id', $labId)
            ->whereNotIn('status', [
                OrderStatus::Delivered->value,
                OrderStatus::Archived->value,
                OrderStatus::Rejected->value,
                OrderStatus::Cancelled->value,
            ])
            ->whereDate('due_date', now())
            ->count();

        $monthRevenue = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum(DB::raw('COALESCE(final_price, price)')) ?? 0;

        // Recent orders (last 10)
        $recentOrders = Order::where('lab_id', $labId)
            ->with(['patient:id,first_name,last_name', 'clinic:id,name', 'service:id,name,price'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('Lab/Dashboard', [
            'stats' => [
                'totalActive' => $totalActive,
                'pendingNew' => $pendingNew,
                'overdueCount' => $overdueCount,
                'dueTodayCount' => $dueTodayCount,
                'monthRevenue' => $monthRevenue,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
