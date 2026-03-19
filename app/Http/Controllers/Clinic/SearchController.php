<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Lab;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    /** @var \App\Models\User $user */
    public function __invoke(Request $request)
    {
        $q = trim($request->get('q', ''));

        if (strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $user = Auth::user();
        $clinicId = $user->clinic_id;

        // 1. Search Orders
        $orders = Order::where('clinic_id', $clinicId)
            ->with(['patient', 'lab', 'service'])
            ->where(function ($query) use ($q) {
                $query->where('id', 'like', "%{$q}%")
                    ->orWhereHas('patient', fn($p) => $p->where('first_name', 'like', "%{$q}%")
                        ->orWhere('last_name', 'like', "%{$q}%"))
                    ->orWhereHas('lab', fn($l) => $l->where('name', 'like', "%{$q}%"))
                    ->orWhereHas('service', fn($s) => $s->where('name', 'like', "%{$q}%"));
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'type'    => 'order',
                'id'      => $o->id,
                'label'   => "Order #{$o->id}",
                'sub'     => ($o->patient ? "{$o->patient->first_name} {$o->patient->last_name}" : "No Patient") . " · " . ($o->lab->name ?? 'No Lab'),
                'status'  => $o->status->value,
                'url'     => route('clinic.orders.show', $o->id),
            ]);

        // 2. Search Patients
        $patients = Patient::where('clinic_id', $clinicId)
            ->where(function ($query) use ($q) {
                $query->where('first_name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'type'    => 'patient',
                'id'      => $p->id,
                'label'   => "{$p->first_name} {$p->last_name}",
                'sub'     => "Patient" . ($p->phone ? " · {$p->phone}" : ""),
                'status'  => 'delivered', // Generic color
                'url'     => route('clinic.patients.show', $p->id),
            ]);

        // 3. Search Labs (Explore)
        $labs = Lab::where('name', 'like', "%{$q}%")
            ->where('is_active', true)
            ->limit(3)
            ->get()
            ->map(fn($l) => [
                'type'    => 'lab',
                'id'      => $l->id,
                'label'   => $l->name,
                'sub'     => "Laboratory" . ($l->address ? " · {$l->address}" : ""),
                'status'  => 'new', // Generic color
                'url'     => route('clinic.explore.show', $l->id),
            ]);

        $results = $orders->concat($patients)->concat($labs);

        return response()->json(['results' => $results]);
    }
}
