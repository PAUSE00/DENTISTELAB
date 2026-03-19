<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction; // For general finance tracking
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Store a payment for an order.
     */
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string|max:500',
        ]);

        $remaining = $order->remaining_balance;

        if ($request->amount > $remaining) {
            return back()->withErrors([
                'amount' => "Payment amount (" . number_format($request->amount, 2) . ") exceeds the remaining balance (" . number_format($remaining, 2) . " MAD)."
            ]);
        }

        DB::transaction(function () use ($request, $order) {
            $payment = $order->registerPayment(
                $request->amount,
                $request->paid_at,
                auth()->user()->id,
                $request->notes
            );

            // Create a general transaction record for the Lab/Clinic financial statement
            Transaction::create([
                'clinic_id' => $order->clinic_id,
                'lab_id' => $order->lab_id,
                'amount' => $request->amount,
                'type' => 'debit', // Money coming from Clinic to Lab
                'category' => 'order_payment',
                'description' => "Cash payment for Order #{$order->id} (Partial/Total)",
                'reference_id' => $payment->id,
                'status' => 'completed',
            ]);
        });

        return back()->with('success', 'Cash payment successfully recorded.');
    }
}
