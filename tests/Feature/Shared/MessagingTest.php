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

class MessagingTest extends TestCase
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
        $service = Service::factory()->create(['lab_id' => $lab->id]);

        $this->order = Order::factory()->create([
            'lab_id' => $lab->id,
            'clinic_id' => $clinic->id,
            'patient_id' => $patient->id,
            'service_id' => $service->id,
            'status' => 'new',
        ]);
    }

    public function test_clinic_can_send_message_on_order()
    {
        $response = $this->actingAs($this->dentist)
            ->postJson(route('chat.store', $this->order), [
                'content' => 'Hello from dentist',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('messages', [
            'order_id' => $this->order->id,
            'user_id' => $this->dentist->id,
            'content' => 'Hello from dentist',
        ]);
    }

    public function test_lab_can_reply_to_message_on_order()
    {
        $this->order->messages()->create([
            'user_id' => $this->dentist->id,
            'content' => 'Initial message'
        ]);

        $response = $this->actingAs($this->labOwner)
            ->postJson(route('chat.store', $this->order), [
                'content' => 'Hello from lab owner',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('messages', [
            'order_id' => $this->order->id,
            'user_id' => $this->labOwner->id,
            'content' => 'Hello from lab owner',
        ]);
    }

    public function test_unauthorized_user_cannot_access_order_chat()
    {
        $otherDentist = User::factory()->create(['role' => 'dentist']);

        $response = $this->actingAs($otherDentist)
            ->getJson(route('chat.index', $this->order));

        $response->assertStatus(403);
    }
}
