<?php

namespace App\Http\Controllers\Clinic;

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
        $clinicId = Auth::user()->clinic_id;
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        // Fetch stats using correct PRD statuses, filtered by date
        $stats = [
            'total_orders' => Order::where('clinic_id', $clinicId)
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->count(),
            'pending_orders' => Order::where('clinic_id', $clinicId)
                ->where('status', OrderStatus::New)
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->count(),
            'completed_orders' => Order::where('clinic_id', $clinicId)
                ->whereIn('status', [OrderStatus::Delivered, OrderStatus::Finished, OrderStatus::Archived])
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->count(),
            'total_spend' => Order::where('clinic_id', $clinicId)
                ->whereIn('status', [OrderStatus::Delivered, OrderStatus::Finished, OrderStatus::Archived])
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->sum('final_price') ?? 0,
            'statusCounts' => Order::where('clinic_id', $clinicId)
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->mapWithKeys(function ($count, $key) {
                    $status = \App\Enums\OrderStatus::tryFrom($key);
                    return [($status ? $status->value : $key) => $count];
                })
                ->toArray(),
        ];

        // Chart Data (Daily volume & spend in period)
        $chartData = [];
        $period = \Carbon\CarbonPeriod::create($startDate, $endDate);

        $dailyStats = Order::where('clinic_id', $clinicId)
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw('DATE(created_at) as date, count(*) as count, SUM(final_price) as spend')
            ->groupBy('date')
            ->get()
            ->keyBy('date')
            ->toArray();

        foreach ($period as $date) {
            $formattedDate = $date->format('Y-m-d');
            $chartData[] = [
                'name' => $date->format('d/m'),
                'orders' => $dailyStats[$formattedDate]['count'] ?? 0,
                'spend' => $dailyStats[$formattedDate]['spend'] ?? 0,
            ];
        }

        // Fetch recent orders (not filtered by date, just latest)
        $recent_orders = Order::where('clinic_id', $clinicId)
            ->with(['patient', 'lab', 'service'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'patient_name' => $order->patient
                        ? $order->patient->first_name . ' ' . $order->patient->last_name
                        : 'Unknown Patient',
                    'service_name' => $order->service ? $order->service->name : 'N/A',
                    'status' => $order->status->value,
                    'created_at' => $order->created_at->toIso8601String(),
                    'due_date' => $order->due_date ? $order->due_date->toIso8601String() : null,
                ];
            });

        return Inertia::render('Clinic/Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'recent_orders' => $recent_orders,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
