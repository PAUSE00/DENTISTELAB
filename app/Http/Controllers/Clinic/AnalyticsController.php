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
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $months->put(Carbon::now()->subMonths($i)->format('M'), 0.0);
        }

        $spendingTrendRaw = Transaction::where('clinic_id', $clinic->id)
            ->where('type', 'debit')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%m') as month"),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month')
            ->get();

        $spendingTrend = $months->map(function ($val, $monthName) use ($spendingTrendRaw) {
            $match = $spendingTrendRaw->first(fn($item) => Carbon::create()->month((int)$item->month)->format('M') === $monthName);
            return [
                'name' => $monthName,
                'total' => $match ? (float)$match->total : 0,
            ];
        })->values();

        // 3. Treatment Trends (Materials)
        $treatmentTrends = Order::where('clinic_id', $clinic->id)
            ->whereNotNull('material')
            ->select('material', DB::raw('count(*) as count'))
            ->groupBy('material')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn($item) => ['name' => $item->material, 'count' => $item->count]);

        // 4. Lab Turnaround Times
        $turnaroundTimes = Order::where('clinic_id', $clinic->id)
            ->where('status', 'delivered')
            ->with('lab')
            ->select('lab_id', DB::raw('AVG(DATEDIFF(updated_at, created_at)) as avg_days'))
            ->groupBy('lab_id')
            ->get()
            ->map(fn($item) => [
                'lab' => $item->lab->name ?? 'Unknown',
                'days' => round((float)$item->avg_days, 1)
            ]);

        // 5. Dentist Performance
        $dentistPerformance = Order::where('orders.clinic_id', $clinic->id)
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select('users.name as dentist_name', DB::raw('count(*) as orders'), DB::raw('SUM(COALESCE(orders.final_price, orders.price)) as revenue'))
            ->groupBy('users.id', 'users.name')
            ->get()
            ->map(fn($item) => [
                'name' => $item->dentist_name,
                'orders' => $item->orders,
                'revenue' => (float)$item->revenue
            ]);

        return Inertia::render('Clinic/Analytics/Index', [
            'stats' => [
                'total_spending' => (float) $totalSpending,
                'active_orders' => $activeOrders,
                'patient_count' => $patientCount,
                'avg_order_value' => $activeOrders > 0 ? $totalSpending / $activeOrders : 0,
            ],
            'chartData' => [
                'spendingTrend' => $spendingTrend,
                'treatmentTrends' => $treatmentTrends,
                'turnaroundTimes' => $turnaroundTimes,
                'dentistPerformance' => $dentistPerformance,
            ],
        ]);
    }
}
