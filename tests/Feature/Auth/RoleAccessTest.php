<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_dentist_is_redirected_to_clinic_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'dentist',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));

        // Follow to dashboard and check role-based redirect
        $dashboardResponse = $this->actingAs($user)->get(route('dashboard'));
        $dashboardResponse->assertRedirect(route('clinic.dashboard'));
    }

    public function test_lab_owner_is_redirected_to_lab_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'lab_owner',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));

        $dashboardResponse = $this->actingAs($user)->get(route('dashboard'));
        $dashboardResponse->assertRedirect(route('lab.dashboard'));
    }

    public function test_dentist_cannot_access_lab_dashboard()
    {
        $user = User::factory()->create(['role' => 'dentist']);
        $response = $this->actingAs($user)->get(route('lab.dashboard'));
        $response->assertStatus(403);
    }

    public function test_lab_owner_cannot_access_clinic_dashboard()
    {
        $user = User::factory()->create(['role' => 'lab_owner']);
        $response = $this->actingAs($user)->get(route('clinic.dashboard'));
        $response->assertStatus(403);
    }
}
