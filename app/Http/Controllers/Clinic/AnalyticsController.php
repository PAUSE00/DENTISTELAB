<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $clinic = $user->clinic;

        // 1. Key Performance Indicators
        $totalSpending = Transaction::where('clinic_id', $clinic->id)
            ->where('type', 'debit')
            ->sum('amount');

        $activeOrders = Order::where('clinic_id', $clinic->id)
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->count();

        $patientCount = Patient::where('clinic_id', $clinic->id)->count();

        // 2. Spending Trend (Last 6 Months)
        $spendingTrend = Transaction::where('clinic_id', $clinic->id)
            ->where('type', 'debit')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%m') as month"),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => Carbon::create()->month((int)$item->month)->format('M'),
                    'total' => (float) $item->total,
                ];
            });

        // 3. Lab Distribution (Orders per Lab)
        $labDistribution = Order::where('clinic_id', $clinic->id)
            ->with('lab')
            ->select('lab_id', DB::raw('count(*) as count'))
            ->groupBy('lab_id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->lab->name ?? 'Unknown',
                    'value' => $item->count,
                ];
            });

        // 4. Order Volume Trend
        $orderVolumeTrend = Order::where('clinic_id', $clinic->id)
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%m') as month"),
                DB::raw('count(*) as count')
            )
            ->groupBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create()->month((int)$item->month)->format('M'),
                    'orders' => $item->count,
                ];
            });

        return Inertia::render('Clinic/Analytics/Index', [
            'stats' => [
                'total_spending' => (float) $totalSpending,
                'active_orders' => $activeOrders,
                'patient_count' => $patientCount,
                'avg_order_value' => Order::where('clinic_id', $clinic->id)->count() > 0 
                    ? $totalSpending / Order::where('clinic_id', $clinic->id)->count() 
                    : 0,
            ],
            'chartData' => [
                'spendingTrend' => $spendingTrend,
                'labDistribution' => $labDistribution,
                'orderVolumeTrend' => $orderVolumeTrend,
            ],
        ]);
    }
}
