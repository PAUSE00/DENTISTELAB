<?php

namespace Tests\Feature\Shared;

use App\Models\Clinic;
use App\Models\Lab;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentGenerationTest extends TestCase
{
    use RefreshDatabase;

    private User $dentist;
    private User $labOwner;
    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::factory()->create();
        $this->dentist = User::factory()->create(['role' => 'dentist', 'clinic_id' => $clinic->id]);

        $this->labOwner = User::factory()->create(['role' => 'lab_owner']);
        $lab = Lab::factory()->create(['owner_id' => $this->labOwner->id]);
        $this->labOwner->update(['lab_id' => $lab->id]);

        $patient = Patient::factory()->create(['clinic_id' => $clinic->id]);
        $service = Service::factory()->create(['lab_id' => $lab->id, 'price' => 150.00]);

        $this->order = Order::factory()->create([
            'lab_id' => $lab->id,
            'clinic_id' => $clinic->id,
            'patient_id' => $patient->id,
            'service_id' => $service->id,
            'status' => 'delivered',
            'final_price' => 150.00,
        ]);
    }

    public function test_dentist_can_generate_invoice_for_order()
    {
        $response = $this->actingAs($this->dentist)
            ->get(route('orders.invoice', $this->order));

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_lab_can_generate_job_ticket_for_order()
    {
        $response = $this->actingAs($this->labOwner)
            ->get(route('orders.job-ticket', $this->order));

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_unauthorized_user_cannot_generate_documents()
    {
        $otherDentist = User::factory()->create(['role' => 'dentist']);

        $response = $this->actingAs($otherDentist)
            ->get(route('orders.invoice', $this->order));

        $response->assertStatus(403);
    }
}
