<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $q = trim($request->get('q', ''));

        if (strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $labId = Auth::user()->lab_id;

        $orders = Order::where('lab_id', $labId)
            ->with(['patient', 'clinic', 'service'])
            ->where(function ($query) use ($q) {
                $query->where('id', 'like', "%{$q}%")
                    ->orWhereHas('patient', fn($p) => $p->where('first_name', 'like', "%{$q}%")
                        ->orWhere('last_name', 'like', "%{$q}%"))
                    ->orWhereHas('clinic', fn($c) => $c->where('name', 'like', "%{$q}%"))
                    ->orWhereHas('service', fn($s) => $s->where('name', 'like', "%{$q}%"));
            })
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn($o) => [
                'type'    => 'order',
                'id'      => $o->id,
                'label'   => "Order #{$o->id}",
                'sub'     => $o->patient
                    ? "{$o->patient->first_name} {$o->patient->last_name} · " . ($o->clinic->name ?? '')
                    : ($o->clinic->name ?? ''),
                'status'  => $o->status->value,
                'url'     => route('lab.orders.show', $o->id),
            ]);

        return response()->json(['results' => $orders]);
    }
}
