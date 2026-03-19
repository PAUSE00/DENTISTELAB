<?php

namespace App\Http\Controllers\Clinic;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user     = Auth::user();
        $clinic   = $user->clinic;
        $clinicId = $clinic->id;

        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date',   now()->endOfMonth()->toDateString());

        // ── Active orders (not terminal) ─────────────────────────────
        $activeOrders = Order::where('clinic_id', $clinicId)
            ->whereNotIn('status', [OrderStatus::Delivered, OrderStatus::Archived, OrderStatus::Cancelled, OrderStatus::Rejected])
            ->count();

        // ── New / awaiting approval ───────────────────────────────────
        $newOrders = Order::where('clinic_id', $clinicId)
            ->where('status', OrderStatus::New)
            ->count();

        // ── Overdue cases (past due_date, not delivered) ──────────────
        $overdue = Order::where('clinic_id', $clinicId)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', today())
            ->whereNotIn('status', [OrderStatus::Delivered, OrderStatus::Archived, OrderStatus::Cancelled])
            ->count();

        // ── Outstanding balance (unpaid + partial orders) ─────────────
        $outstanding = Order::where('clinic_id', $clinicId)
            ->whereIn('payment_status', ['unpaid', 'partial'])
            ->whereNotIn('status', [OrderStatus::Cancelled, OrderStatus::Rejected])
            ->selectRaw('SUM(COALESCE(final_price, price) - COALESCE(paid_amount, 0)) as balance')
            ->value('balance') ?? 0;

        // ── Patients count ────────────────────────────────────────────
        $patientCount = Patient::where('clinic_id', $clinicId)->count();

        // ── New patients this month ───────────────────────────────────
        $newPatientsThisMonth = Patient::where('clinic_id', $clinicId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // ── Today's appointments ──────────────────────────────────────
        $todayAppointments = Appointment::where('clinic_id', $clinicId)
            ->whereDate('start_time', today())
            ->whereNot('status', 'cancelled')
            ->with(['patient:id,first_name,last_name', 'doctor:id,name'])
            ->orderBy('start_time')
            ->get()
            ->map(fn($a) => [
                'id'           => $a->id,
                'patient_name' => $a->patient ? "{$a->patient->first_name} {$a->patient->last_name}" : 'Unknown',
                'doctor_name'  => $a->doctor?->name ?? '—',
                'start_time'   => $a->start_time,
                'status'       => $a->status,
            ]);

        // ── Delivered this month (completed cases) ────────────────────
        $completedThisMonth = Order::where('clinic_id', $clinicId)
            ->where('status', OrderStatus::Delivered)
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->count();

        // ── Chart: Monthly order counts (last 6 months) ───────────────
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $dt = now()->subMonths($i);
            $months->push([
                'name'   => $dt->format('M'),
                'orders' => 0,
                'spend'  => 0.0,
            ]);
        }

        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        $ordersByMonth = Order::where('clinic_id', $clinicId)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at,'%b') as m, count(*) as orders, SUM(COALESCE(final_price,price)) as spend")
            ->groupBy('m')
            ->get()
            ->keyBy('m');

        $chartData = $months->map(function ($entry) use ($ordersByMonth) {
            $row = $ordersByMonth->get($entry['name']);
            return [
                'name'   => $entry['name'],
                'orders' => $row ? (int)$row->orders : 0,
                'spend'  => $row ? (float)$row->spend : 0.0,
            ];
        })->values();

        // ── Recent orders ─────────────────────────────────────────────
        $recent_orders = Order::where('clinic_id', $clinicId)
            ->with(['patient:id,first_name,last_name', 'lab:id,name', 'service:id,name'])
            ->latest()
            ->take(7)
            ->get()
            ->map(fn($o) => [
                'id'           => $o->id,
                'patient_name' => $o->patient ? "{$o->patient->first_name} {$o->patient->last_name}" : 'Unknown',
                'lab_name'     => $o->lab?->name ?? '—',
                'service_name' => $o->service?->name ?? 'N/A',
                'status'       => $o->status->value,
                'payment_status' => $o->payment_status?->value ?? 'unpaid',
                'created_at'   => $o->created_at->toIso8601String(),
                'due_date'     => $o->due_date?->toIso8601String(),
            ]);

        // ── Status breakdown ──────────────────────────────────────────
        $statusBreakdown = Order::where('clinic_id', $clinicId)
            ->whereNotIn('status', [OrderStatus::Archived, OrderStatus::Cancelled])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('Clinic/Dashboard', [
            'stats' => [
                'active_orders'          => $activeOrders,
                'new_orders'             => $newOrders,
                'overdue'                => $overdue,
                'outstanding'            => (float) $outstanding,
                'patient_count'          => $patientCount,
                'new_patients_month'     => $newPatientsThisMonth,
                'completed_this_month'   => $completedThisMonth,
                // Backward-compat aliases (chart still uses these)
                'total_orders'           => $activeOrders,
                'pending_orders'         => $newOrders,
                'completed_orders'       => $completedThisMonth,
                'total_spend'            => (float) $outstanding,
            ],
            'chartData'          => $chartData,
            'recent_orders'      => $recent_orders,
            'today_appointments' => $todayAppointments,
            'status_breakdown'   => $statusBreakdown,
            'filters' => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ],
        ]);
    }
}
