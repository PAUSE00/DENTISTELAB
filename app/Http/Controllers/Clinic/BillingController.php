<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $clinic = auth()->user()->clinic;

        $invoices = Invoice::with(['lab', 'order'])
            ->where('clinic_id', $clinic->id)
            ->latest()
            ->get();

        $transactions = Transaction::with('lab')
            ->where('clinic_id', $clinic->id)
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'total_spent' => $transactions->where('type', 'debit')->sum('amount'),
            'outstanding' => $invoices->where('status', 'sent')->sum('total'),
            'last_month_growth' => 12.5, // Mock
        ];

        return Inertia::render('Clinic/Billing/Index', [
            'invoices' => $invoices,
            'transactions' => $transactions,
            'stats' => $stats,
        ]);
    }

    public function showInvoice(Invoice $invoice)
    {
        if ($invoice->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $invoice->load(['lab', 'order.patient', 'order.service']);

        return Inertia::render('Clinic/Billing/InvoiceShow', [
            'invoice' => $invoice,
        ]);
    }
}
