<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $labId = Auth::user()->lab_id;
        $now   = Carbon::now();

        // ── Summary stats ──────────────────────────────────────────────────
        $activeStatuses = [
            OrderStatus::Delivered->value,
            OrderStatus::Archived->value,
            OrderStatus::Rejected->value,
            OrderStatus::Cancelled->value,
        ];

        $totalActive = Order::where('lab_id', $labId)
            ->whereNotIn('status', $activeStatuses)
            ->count();

        $pendingNew = Order::where('lab_id', $labId)
            ->where('status', OrderStatus::New->value)
            ->count();

        $overdueCount = Order::where('lab_id', $labId)
            ->whereNotIn('status', $activeStatuses)
            ->where('due_date', '<', $now)
            ->count();

        $dueTodayCount = Order::where('lab_id', $labId)
            ->whereNotIn('status', $activeStatuses)
            ->whereDate('due_date', $now)
            ->count();

        $monthRevenue = (float) (Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
            ->sum(DB::raw('COALESCE(final_price, price)')) ?? 0);

        $lastMonthRevenue = (float) (Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Delivered->value, OrderStatus::Finished->value, OrderStatus::Archived->value])
            ->whereBetween('created_at', [$now->copy()->subMonth()->startOfMonth(), $now->copy()->subMonth()->endOfMonth()])
            ->sum(DB::raw('COALESCE(final_price, price)')) ?? 0);

        $unpaidCount = Order::where('lab_id', $labId)
            ->whereIn('status', [OrderStatus::Finished->value, OrderStatus::Delivered->value])
            ->where(fn($q) => $q->where('payment_status', 'unpaid')->orWhereNull('payment_status'))
            ->count();

        // ── New orders inbox ───────────────────────────────────────────────
        $newOrdersInbox = Order::where('lab_id', $labId)
            ->where('status', OrderStatus::New->value)
            ->with(['patient:id,first_name,last_name', 'clinic:id,name', 'service:id,name'])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn($o) => [
                'id'         => $o->id,
                'priority'   => $o->priority ?? 'normal',
                'created_at' => $o->created_at->diffForHumans(),
                'due_date'   => $o->due_date?->toDateString(),
                'patient'    => $o->patient ? ['first_name' => $o->patient->first_name, 'last_name' => $o->patient->last_name] : null,
                'clinic'     => $o->clinic  ? ['name' => $o->clinic->name]   : null,
                'service'    => $o->service ? ['name' => $o->service->name]  : null,
            ]);

        // ── Weekly volume (last 7 days) ─────────────────────────────────────
        $weeklyVolume = collect(range(6, 0))->map(function ($daysAgo) use ($labId) {
            $date = Carbon::now()->subDays($daysAgo);
            $count = Order::where('lab_id', $labId)
                ->whereDate('created_at', $date)
                ->count();
            return [
                'day'    => $date->format('D'),
                'date'   => $date->toDateString(),
                'orders' => $count,
            ];
        });

        // ── Top services ───────────────────────────────────────────────────
        $topServices = Order::where('lab_id', $labId)
            ->whereNotNull('service_id')
            ->select('service_id', DB::raw('count(*) as count'))
            ->groupBy('service_id')
            ->orderByDesc('count')
            ->limit(6)
            ->with('service:id,name')
            ->get()
            ->map(fn($o) => ['name' => $o->service?->name ?? 'Unknown', 'count' => $o->count]);

        // ── Activity feed ──────────────────────────────────────────────────
        $activityFeed = Order::where('lab_id', $labId)
            ->with(['clinic:id,name'])
            ->whereNotNull('status')
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get()
            ->map(fn($o) => [
                'order_id'   => $o->id,
                'status'     => $o->status,
                'changed_by' => 'Lab',
                'clinic'     => $o->clinic?->name ?? '—',
                'at'         => $o->updated_at->diffForHumans(),
                'at_exact'   => $o->updated_at->toDateTimeString(),
            ]);

        // ── Recent orders ──────────────────────────────────────────────────
        $recentOrders = Order::where('lab_id', $labId)
            ->with(['patient:id,first_name,last_name', 'clinic:id,name', 'service:id,name,price'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('Lab/Dashboard', [
            'stats' => [
                'totalActive'      => $totalActive,
                'pendingNew'       => $pendingNew,
                'overdueCount'     => $overdueCount,
                'dueTodayCount'    => $dueTodayCount,
                'monthRevenue'     => $monthRevenue,
                'lastMonthRevenue' => $lastMonthRevenue,
                'unpaidCount'      => $unpaidCount,
            ],
            'recentOrders'   => $recentOrders,
            'newOrdersInbox' => $newOrdersInbox,
            'weeklyVolume'   => $weeklyVolume,
            'topServices'    => $topServices,
            'activityFeed'   => $activityFeed,
        ]);
    }
}
