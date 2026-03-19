<?php

namespace App\Http\Controllers\Lab;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FinanceController extends Controller
{
    /**
     * Display finance dashboard with payment tracking.
     */
    public function index(Request $request)
    {
        $labId = Auth::user()->lab_id;

        // ── Summary Stats ────────────────────────────────────
        $revenueStats = Order::where('lab_id', $labId)
            ->whereNotIn('status', [OrderStatus::Rejected, OrderStatus::Archived])
            ->selectRaw('SUM(paid_amount) as total_revenue, SUM(COALESCE(final_price, price) - paid_amount) as pending_amount')
            ->first();

        $monthlyRevenue = Order::where('lab_id', $labId)
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->sum('paid_amount') ?: 0;

        $stats = [
            'total_revenue' => (float) ($revenueStats->total_revenue ?? 0),
            'pending_amount' => (float) ($revenueStats->pending_amount ?? 0),
            'monthly_revenue' => (float) $monthlyRevenue,
            'unpaid_count' => Order::where('lab_id', $labId)->where('payment_status', PaymentStatus::Unpaid)->count(),
            'partial_count' => Order::where('lab_id', $labId)->where('payment_status', PaymentStatus::Partial)->count(),
            'paid_count' => Order::where('lab_id', $labId)->where('payment_status', PaymentStatus::Paid)->count(),
        ];

        // ── Clinic Balances ──────────────────────────────────
        $clinicBalances = Order::where('lab_id', $labId)
            ->whereIn('payment_status', [PaymentStatus::Unpaid, PaymentStatus::Partial])
            ->whereNotIn('status', [OrderStatus::Rejected, OrderStatus::Archived])
            ->with('clinic')
            ->get()
            ->groupBy('clinic_id')
            ->map(function ($orders, $clinicId) {
                $clinic = $orders->first()->clinic;
                return [
                    'clinic_id' => $clinicId,
                    'clinic_name' => $clinic ? $clinic->name : 'Unknown',
                    'open_balance' => (float) $orders->sum(function ($order) {
                        return ($order->final_price ?? $order->price) - $order->paid_amount;
                    }),
                    'orders_count' => $orders->count(),
                ];
            })->values();

        // ── Orders List with payment filtering ───────────────
        $query = Order::with(['patient', 'clinic', 'service'])
            ->where('lab_id', $labId);

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('clinic', fn($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('patient', fn($q) => $q->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Lab/Finance/Index', [
            'stats' => $stats,
            'clinic_balances' => $clinicBalances,
            'orders' => $orders,
            'filters' => $request->only(['payment_status', 'search']),
        ]);
    }

    /**
     * Mark all unpaid orders for a clinic as Paid.
     */
    public function markClinicPaid(Request $request, Clinic $clinic)
    {
        $labId = Auth::user()->lab_id;

        Order::where('lab_id', $labId)
            ->where('clinic_id', $clinic->id)
            ->whereIn('payment_status', [PaymentStatus::Unpaid, PaymentStatus::Partial])
            ->whereNotIn('status', [OrderStatus::Rejected, OrderStatus::Archived])
            ->update([
                'paid_amount' => \Illuminate\Support\Facades\DB::raw('COALESCE(final_price, price)'),
                'payment_status' => PaymentStatus::Paid
            ]);

        return redirect()->back()->with('success', 'Clinic balance marked as paid.');
    }
}
