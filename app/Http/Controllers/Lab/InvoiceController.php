<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $lab = $request->user()->lab;

        $invoices = Invoice::where('lab_id', $lab->id)
            ->with(['clinic'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Lab/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(Request $request)
    {
        $lab = $request->user()->lab;

        // Get clinics with uninvoiced orders
        $clinics = Clinic::whereHas('orders', function ($query) use ($lab) {
            $query->where('lab_id', $lab->id)
                ->whereNull('invoice_id')
                ->whereNotNull('price');
        })->get();

        return Inertia::render('Lab/Invoices/Create', [
            'clinics' => $clinics,
        ]);
    }

    public function getClinicsOrders(Request $request, Clinic $clinic)
    {
        $lab = $request->user()->lab;

        $orders = Order::where('clinic_id', $clinic->id)
            ->where('lab_id', $lab->id)
            ->whereNull('invoice_id')
            ->whereNotNull('price')
            ->with(['patient', 'service'])
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'clinic_id' => 'required|exists:clinics,id',
            'order_ids' => 'required|array|min:1',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $lab = $request->user()->lab;

        DB::transaction(function () use ($request, $lab) {
            $orders = Order::whereIn('id', $request->order_ids)
                ->where('lab_id', $lab->id)
                ->whereNull('invoice_id')
                ->get();

            if ($orders->isEmpty()) {
                throw new \Exception('No valid orders selected.');
            }

            $totalAmount = $orders->sum('price');
            
            // Generate invoice number: INV-LABID-YEAR-RAND
            $invoiceNumber = 'INV-' . $lab->id . '-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'lab_id' => $lab->id,
                'clinic_id' => $request->clinic_id,
                'total_amount' => $totalAmount,
                'status' => 'sent',
                'due_date' => $request->due_date,
                'notes' => $request->notes,
            ]);

            Order::whereIn('id', $orders->pluck('id'))->update([
                'invoice_id' => $invoice->id,
            ]);
        });

        return redirect()->route('lab.invoices.index')->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['clinic', 'orders.patient', 'orders.service']);

        return Inertia::render('Lab/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $request->validate([
            'status' => 'required|in:draft,sent,paid,cancelled',
        ]);

        $invoice->update([
            'status' => $request->status,
            'paid_at' => $request->status === 'paid' ? now() : $invoice->paid_at,
        ]);

        return back()->with('success', 'Invoice status updated.');
    }
}
