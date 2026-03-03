<?php

namespace Tests\Feature\Lab;

use App\Models\Clinic;
use App\Models\Lab;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderProcessingTest extends TestCase
{
    use RefreshDatabase;

    private User $labOwner;
    private Lab $lab;
    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->labOwner = User::factory()->create(['role' => 'lab_owner']);
        $this->lab = Lab::factory()->create(['owner_id' => $this->labOwner->id]);

        // Make sure the lab owner belongs to the lab
        $this->labOwner->update(['lab_id' => $this->lab->id]);

        $clinic = Clinic::factory()->create();
        $patient = Patient::factory()->create(['clinic_id' => $clinic->id]);
        $service = Service::factory()->create(['lab_id' => $this->lab->id]);

        $this->order = Order::factory()->create([
            'lab_id' => $this->lab->id,
            'clinic_id' => $clinic->id,
            'patient_id' => $patient->id,
            'service_id' => $service->id,
            'status' => 'new',
        ]);
    }

    public function test_lab_can_view_assigned_orders()
    {
        $response = $this->actingAs($this->labOwner)
            ->get(route('lab.orders.index'));

        $response->assertStatus(200);
        $response->assertSee($this->order->id);
    }

    public function test_lab_can_update_order_status()
    {
        $response = $this->actingAs($this->labOwner)
            ->patch(route('lab.orders.update-status', $this->order), [
                'status' => 'in_progress',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $this->order->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_lab_cannot_update_unassigned_orders()
    {
        $otherLabOwner = User::factory()->create(['role' => 'lab_owner']);
        $otherLab = Lab::factory()->create(['owner_id' => $otherLabOwner->id]);
        $otherLabOwner->update(['lab_id' => $otherLab->id]);

        $response = $this->actingAs($otherLabOwner)
            ->patch(route('lab.orders.update-status', $this->order), [
                'status' => 'in_progress',
            ]);

        $response->assertStatus(403);
    }
}
