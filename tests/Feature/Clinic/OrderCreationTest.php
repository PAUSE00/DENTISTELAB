<?php

namespace Tests\Feature\Clinic;

use App\Models\Clinic;
use App\Models\Lab;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    private User $dentist;
    private Clinic $clinic;
    private Lab $lab;
    private Service $service;
    private Patient $patient;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clinic = Clinic::factory()->create();
        $this->dentist = User::factory()->create([
            'role' => 'dentist',
            'clinic_id' => $this->clinic->id,
        ]);

        // Ensure labs have an owner
        $labOwner = User::factory()->create(['role' => 'lab_owner']);

        $this->lab = Lab::factory()->create(['owner_id' => $labOwner->id]);
        $this->service = Service::factory()->create(['lab_id' => $this->lab->id]);
        $this->patient = Patient::factory()->create(['clinic_id' => $this->clinic->id]);
    }

    public function test_dentist_can_create_order()
    {
        $orderData = [
            'patient_id' => $this->patient->id,
            'lab_id' => $this->lab->id,
            'service_id' => $this->service->id,
            'due_date' => now()->addDays(5)->format('Y-m-d'),
            'priority' => 'normal',
            'teeth' => [11, 12, 21],
            'shade' => 'A1',
            'material' => 'Zirconia',
            'instructions' => 'Make it look natural',
        ];

        $response = $this->actingAs($this->dentist)
            ->post(route('clinic.orders.store'), $orderData);

        $response->assertRedirect(route('clinic.orders.index'));

        $this->assertDatabaseHas('orders', [
            'patient_id' => $this->patient->id,
            'clinic_id' => $this->clinic->id,
            'lab_id' => $this->lab->id,
            'status' => 'new',
        ]);
    }

    public function test_order_creation_validates_required_fields()
    {
        $response = $this->actingAs($this->dentist)
            ->post(route('clinic.orders.store'), []);

        $response->assertSessionHasErrors(['patient_id', 'lab_id', 'service_id', 'due_date', 'priority', 'teeth', 'shade', 'material']);
    }
}
