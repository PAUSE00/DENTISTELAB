<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $labId = Auth::user()->lab_id;

        $activeStatuses = [
            OrderStatus::New->value, OrderStatus::InProgress->value,
            OrderStatus::Fitting->value, OrderStatus::Finished->value,
            OrderStatus::Shipped->value,
        ];

        $base = Order::where('lab_id', $labId)
            ->whereIn('status', $activeStatuses)
            ->whereNotNull('due_date')
            ->with(['patient', 'clinic', 'service']);

        $today    = Carbon::today();
        $weekEnd  = Carbon::today()->endOfWeek();
        $monthEnd = Carbon::today()->endOfMonth();

        $map = fn($o) => [
            'id'         => $o->id,
            'status'     => $o->status->value,
            'priority'   => $o->priority,
            'due_date'   => $o->due_date->toDateString(),
            'is_overdue' => $o->due_date->isPast(),
            'patient'    => $o->patient ? [
                'first_name' => $o->patient->first_name,
                'last_name'  => $o->patient->last_name,
            ] : null,
            'clinic'     => $o->clinic ? ['name' => $o->clinic->name] : null,
            'service'    => $o->service ? ['name' => $o->service->name] : null,
        ];

        // Overdue (past due_date)
        $overdue = (clone $base)->whereDate('due_date', '<', $today)
            ->orderBy('due_date')->get()->map($map);

        // Due today
        $dueToday = (clone $base)->whereDate('due_date', $today)
            ->orderBy('due_date')->get()->map($map);

        // Due this week (tomorrow → weekEnd)
        $dueThisWeek = (clone $base)
            ->whereDate('due_date', '>', $today)
            ->whereDate('due_date', '<=', $weekEnd)
            ->orderBy('due_date')->get()->map($map);

        // Due this month (after this week → monthEnd)
        $dueThisMonth = (clone $base)
            ->whereDate('due_date', '>', $weekEnd)
            ->whereDate('due_date', '<=', $monthEnd)
            ->orderBy('due_date')->get()->map($map);

        // Coming up (beyond this month)
        $upcoming = (clone $base)
            ->whereDate('due_date', '>', $monthEnd)
            ->orderBy('due_date')->limit(20)->get()->map($map);

        // Calendar grid data for the current month (all orders with due_date in month)
        $calendarOrders = Order::where('lab_id', $labId)
            ->whereNotNull('due_date')
            ->whereYear('due_date', $today->year)
            ->whereMonth('due_date', $today->month)
            ->with(['patient', 'service'])
            ->get()
            ->groupBy(fn($o) => $o->due_date->format('Y-m-d'))
            ->map(fn($group) => $group->map(fn($o) => [
                'id'       => $o->id,
                'status'   => $o->status->value,
                'priority' => $o->priority,
                'patient'  => $o->patient ? "{$o->patient->first_name} {$o->patient->last_name}" : '—',
                'service'  => $o->service?->name,
            ])->values());

        return Inertia::render('Lab/Calendar', [
            'overdue'        => $overdue,
            'dueToday'       => $dueToday,
            'dueThisWeek'    => $dueThisWeek,
            'dueThisMonth'   => $dueThisMonth,
            'upcoming'       => $upcoming,
            'calendarOrders' => $calendarOrders,
            'todayDate'      => $today->toDateString(),
            'currentMonth'   => $today->month,
            'currentYear'    => $today->year,
        ]);
    }
}
