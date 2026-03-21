<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KanbanController extends Controller
{
    public function index()
    {
        $labId = \Illuminate\Support\Facades\Auth::user()->lab_id;

        $activeStatuses = [
            OrderStatus::New,
            OrderStatus::InProgress,
            OrderStatus::Fitting,
            OrderStatus::Finished,
            OrderStatus::Shipped,
        ];

        $columns = [];

        foreach ($activeStatuses as $status) {
            // Cache the orders for this column for 1 minute (Redis)
            $orders = \Illuminate\Support\Facades\Cache::remember(
                "lab.{$labId}.kanban.{$status->value}",
                60,
                function () use ($labId, $status) {
                    return Order::where('lab_id', $labId)
                        ->where('status', $status)
                        ->with(['patient:id,first_name,last_name', 'clinic:id,name', 'service:id,name'])
                        ->orderBy('due_date')
                        ->get()
                        ->map(fn($o) => [
                            'id'          => $o->id,
                            'status'      => $o->status->value,
                            'priority'    => $o->priority,
                            'due_date'    => $o->due_date?->toDateString(),
                            'is_overdue'  => $o->due_date && $o->due_date->isPast()
                                             && !in_array($o->status, [OrderStatus::Delivered, OrderStatus::Archived]),
                            'patient'     => $o->patient ? [
                                'first_name' => $o->patient->first_name,
                                'last_name'  => $o->patient->last_name,
                            ] : null,
                            'clinic'      => $o->clinic ? ['name' => $o->clinic->name] : null,
                            'service'     => $o->service ? ['name' => $o->service->name] : null,
                        ]);
                }
            );

            $columns[] = [
                'status' => $status->value,
                'label'  => $status->label(),
                'orders' => $orders,
                'count'  => $orders->count(),
            ];
        }

        return Inertia::render('Lab/Kanban', [
            'columns' => $columns,
        ]);
    }
}
