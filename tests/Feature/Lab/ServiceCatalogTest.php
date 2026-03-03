<?php

namespace Tests\Feature\Lab;

use App\Models\Lab;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceCatalogTest extends TestCase
{
    use RefreshDatabase;

    private User $labOwner;
    private Lab $lab;

    protected function setUp(): void
    {
        parent::setUp();

        $this->labOwner = User::factory()->create(['role' => 'lab_owner']);
        $this->lab = Lab::factory()->create(['owner_id' => $this->labOwner->id]);
        $this->labOwner->update(['lab_id' => $this->lab->id]);
    }

    public function test_lab_can_create_service()
    {
        $serviceData = [
            'name' => 'Premium Crown',
            'description' => 'A high quality crown',
            'price' => 250.00,
            'production_days' => 5,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->labOwner)
            ->post(route('lab.services.store'), $serviceData);

        $response->assertRedirect(route('lab.services.index'));

        $this->assertDatabaseHas('services', [
            'name' => 'Premium Crown',
            'lab_id' => $this->lab->id,
            'price' => 250.00,
        ]);
    }

    public function test_lab_can_update_service()
    {
        $service = Service::factory()->create([
            'lab_id' => $this->lab->id,
            'name' => 'Old Service Name',
        ]);

        $updateData = [
            'name' => 'Updated Service Name',
            'description' => $service->description,
            'price' => 300.00,
            'production_days' => 4,
            'is_active' => false,
        ];

        $response = $this->actingAs($this->labOwner)
            ->put(route('lab.services.update', $service), $updateData);

        $response->assertRedirect(route('lab.services.index'));

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'name' => 'Updated Service Name',
            'price' => 300.00,
            'is_active' => 0,
        ]);
    }

    public function test_lab_cannot_edit_other_lab_services()
    {
        $otherLabOwner = User::factory()->create(['role' => 'lab_owner']);
        $otherLab = Lab::factory()->create(['owner_id' => $otherLabOwner->id]);
        $otherLabOwner->update(['lab_id' => $otherLab->id]);

        $otherService = Service::factory()->create([
            'lab_id' => $otherLab->id,
        ]);

        $response = $this->actingAs($this->labOwner)
            ->put(route('lab.services.update', $otherService), [
                'name' => 'Hacked Name',
                'description' => 'Hacked Description',
                'price' => 10,
                'production_days' => 1,
                'is_active' => true,
            ]);

        $response->assertStatus(403);
    }
}
