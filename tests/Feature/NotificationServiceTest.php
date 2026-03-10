<?php

namespace Tests\Feature;

use App\Models\Clinic;
use App\Models\Lab;
use App\Models\Notification;
use App\Models\Order;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationServiceTest extends TestCase
{
    use RefreshDatabase;

    private NotificationService $service;
    private Lab $lab;
    private Clinic $clinic;
    private User $labOwner;
    private User $dentist;
    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(NotificationService::class);

        $this->labOwner = User::factory()->create(['role' => 'lab_owner']);
        $this->lab = Lab::factory()->create(['owner_id' => $this->labOwner->id]);
        $this->labOwner->update(['lab_id' => $this->lab->id]);

        $this->clinic = Clinic::factory()->create();
        $this->dentist = User::factory()->create([
            'role' => 'dentist',
            'clinic_id' => $this->clinic->id,
        ]);

        $service = \App\Models\Service::factory()->create(['lab_id' => $this->lab->id]);
        $patient = \App\Models\Patient::factory()->create(['clinic_id' => $this->clinic->id]);

        $this->order = Order::factory()->create([
            'clinic_id' => $this->clinic->id,
            'lab_id' => $this->lab->id,
            'service_id' => $service->id,
            'patient_id' => $patient->id,
        ]);
    }

    public function test_new_message_creates_notifications_for_lab_users(): void
    {
        $this->service->newMessage($this->order, $this->dentist);

        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $this->labOwner->id,
            'type' => 'new_message',
        ]);
    }

    public function test_new_message_creates_notifications_for_clinic_users(): void
    {
        $this->service->newMessage($this->order, $this->labOwner);

        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $this->dentist->id,
            'type' => 'new_message',
        ]);
    }

    public function test_sender_is_excluded_from_notifications(): void
    {
        $this->service->newMessage($this->order, $this->dentist);

        $this->assertDatabaseMissing('app_notifications', [
            'user_id' => $this->dentist->id,
            'type' => 'new_message',
        ]);
    }

    public function test_invitation_accepted_notifies_lab_users(): void
    {
        $this->service->invitationAccepted($this->lab->id, 'Test Clinic');

        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $this->labOwner->id,
            'type' => 'invitation_accepted',
        ]);
    }

    public function test_invitation_received_notifies_clinic_users(): void
    {
        $this->service->invitationReceived($this->clinic->id, 'Test Lab');

        $this->assertDatabaseHas('app_notifications', [
            'user_id' => $this->dentist->id,
            'type' => 'invitation_received',
        ]);
    }
}
