<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientInvoice;
use App\Models\PatientInvoiceItem;
use App\Models\PatientPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PatientInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $clinic = Auth::user()->clinic;
        $query = $clinic->patientInvoices()->with('patient');

        if ($request->filled('search')) {
            $query->whereHas('patient', function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            })->orWhere('invoice_number', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('payment_status', $request->status);
        }

        $invoices = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Clinic/Billing/PatientInvoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status']),
            'summary' => [
                'total_billed' => $clinic->patientInvoices()->sum('total'),
                'total_paid' => $clinic->patientInvoices()->sum('paid_amount'),
                'outstanding' => $clinic->patientInvoices()->where('payment_status', '!=', 'paid')->get()->sum(function($i){
                    return $i->total - $i->paid_amount;
                }),
            ]
        ]);
    }

    public function create(Request $request)
    {
        $patients = Auth::user()->clinic->patients()->select('id', 'first_name', 'last_name')->get();
        $preselectedPatientId = $request->input('patient_id');

        return Inertia::render('Clinic/Billing/PatientInvoices/Create', [
            'patients' => $patients,
            'preselectedPatientId' => $preselectedPatientId ? (int)$preselectedPatientId : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $clinic = Auth::user()->clinic;
            
            // Generate unique invoice number
            $count = $clinic->patientInvoices()->count() + 1;
            $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);

            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            $discount = $validated['discount'] ?? 0;
            $total = $subtotal - $discount;

            $invoice = PatientInvoice::create([
                'clinic_id' => $clinic->id,
                'patient_id' => $validated['patient_id'],
                'appointment_id' => $validated['appointment_id'],
                'invoice_number' => $invoiceNumber,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'status' => 'issued',
                'payment_status' => 'unpaid',
                'notes' => $validated['notes'],
                'due_date' => $validated['due_date'],
                'issued_at' => now(),
            ]);

            foreach ($validated['items'] as $itemData) {
                PatientInvoiceItem::create([
                    'patient_invoice_id' => $invoice->id,
                    'description' => $itemData['description'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total' => $itemData['quantity'] * $itemData['unit_price'],
                ]);
            }

            return redirect()->route('clinic.patient-invoices.show', $invoice->id)
                ->with('success', 'Invoice created successfully');
        });
    }

    public function show(PatientInvoice $patientInvoice)
    {
        $this->authorize('view', $patientInvoice);
        
        $patientInvoice->load(['patient', 'items', 'payments.recorder']);
        
        return Inertia::render('Clinic/Billing/PatientInvoices/Show', [
            'invoice' => $patientInvoice
        ]);
    }

    public function storePayment(Request $request, PatientInvoice $patientInvoice)
    {
        $this->authorize('update', $patientInvoice);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|in:cash,card,bank_transfer,insurance,other',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $patientInvoice) {
            PatientPayment::create([
                'patient_invoice_id' => $patientInvoice->id,
                'recorded_by' => Auth::id(),
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'paid_at' => $validated['paid_at'],
                'notes' => $validated['notes'],
            ]);

            $patientInvoice->increment('paid_amount', $validated['amount']);
            
            if ($patientInvoice->paid_amount >= $patientInvoice->total) {
                $patientInvoice->update(['payment_status' => 'paid']);
            } elseif ($patientInvoice->paid_amount > 0) {
                $patientInvoice->update(['payment_status' => 'partial']);
            }
        });

        return back()->with('success', 'Payment recorded successfully');
    }

    public function destroy(PatientInvoice $patientInvoice)
    {
        $this->authorize('delete', $patientInvoice);
        $patientInvoice->delete();
        return redirect()->route('clinic.patient-invoices.index')->with('success', 'Invoice deleted');
    }
}
