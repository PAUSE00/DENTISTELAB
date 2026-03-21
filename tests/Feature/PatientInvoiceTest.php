<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Patient;
use App\Models\PatientInvoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientInvoiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $clinicUser;
    protected Clinic $clinic;
    protected Patient $patient;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clinic = Clinic::factory()->create();
        $this->clinicUser = User::factory()->create([
            'role' => 'dentist',
            'clinic_id' => $this->clinic->id
        ]);
        
        $this->patient = Patient::factory()->create([
            'clinic_id' => $this->clinic->id
        ]);
    }

    public function test_invoice_mathematical_creation()
    {
        $payload = [
            'patient_id' => $this->patient->id,
            'issue_date' => now()->format('Y-m-d'),
            'discount' => 150.00,
            'items' => [
                [
                    'description' => 'Crown Base',
                    'quantity' => 2,
                    'unit_price' => 500.00
                ],
                [
                    'description' => 'X-Ray',
                    'quantity' => 1,
                    'unit_price' => 100.00
                ]
            ]
        ];

        $response = $this->actingAs($this->clinicUser)
            ->post(route('clinic.patient-invoices.store'), $payload);

        if ($response->exception) {
            dump($response->exception->getMessage());
        }
        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $invoice = PatientInvoice::first();
        
        $this->assertNotNull($invoice);
        
        // Assert mathematical calculations (2*500) + (1*100) = 1100
        $this->assertEquals(1100.00, $invoice->subtotal);
        $this->assertEquals(150.00, $invoice->discount);
        
        // Asset total = 1100 - 150 = 950
        $this->assertEquals(950.00, $invoice->total);
        
        $this->assertEquals(0, $invoice->paid_amount);
        $this->assertEquals('unpaid', $invoice->payment_status);
        $this->assertCount(2, $invoice->items);
    }

    public function test_invoice_payment_logic_and_status_transitions()
    {
        // First create a baseline invoice directly representing $1000 total
        $invoice = PatientInvoice::create([
            'clinic_id' => $this->clinic->id,
            'patient_id' => $this->patient->id,
            'invoice_number' => 'INV-TEST-001',
            'subtotal' => 1000.00,
            'discount' => 0,
            'total' => 1000.00,
            'status' => 'issued',
            'payment_status' => 'unpaid',
            'issued_at' => now(),
        ]);

        // 1st Partial Payment
        $response = $this->actingAs($this->clinicUser)
            ->post(route('clinic.patient-invoices.payments.store', $invoice->id), [
                'amount' => 300.00,
                'method' => 'cash',
                'paid_at' => now()->format('Y-m-d'),
            ]);

        if ($response->exception) {
            dump($response->exception->getMessage());
        }
        $response->assertSessionHasNoErrors();
        $invoice->refresh();

        $this->assertEquals(300.00, $invoice->paid_amount);
        $this->assertEquals('partial', $invoice->payment_status);
        $this->assertCount(1, $invoice->payments);

        // 2nd Payment (Completes it)
        $this->actingAs($this->clinicUser)
            ->post(route('clinic.patient-invoices.payments.store', $invoice->id), [
                'amount' => 700.00,
                'method' => 'card',
                'paid_at' => now()->format('Y-m-d'),
            ]);

        $invoice->refresh();

        $this->assertEquals(1000.00, $invoice->paid_amount);
        $this->assertEquals('paid', $invoice->payment_status);
        $this->assertCount(2, $invoice->payments);
    }
}
