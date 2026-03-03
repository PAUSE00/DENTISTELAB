<?php

namespace Tests\Feature\Clinic;

use App\Models\Clinic;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $dentist;
    private Clinic $clinic;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clinic = Clinic::factory()->create();
        $this->dentist = User::factory()->create([
            'role' => 'dentist',
            'clinic_id' => $this->clinic->id,
        ]);
    }

    public function test_dentist_can_create_patient()
    {
        $patientData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'dob' => '1990-01-01',
            'phone' => '1234567890',
            'email' => 'john@example.com',
            'medical_notes' => 'No allergies.',
        ];

        $response = $this->actingAs($this->dentist)
            ->post(route('clinic.patients.store'), $patientData);

        $response->assertRedirect(route('clinic.patients.index'));
        $this->assertDatabaseHas('patients', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'clinic_id' => $this->clinic->id,
        ]);
    }

    public function test_dentist_can_update_patient()
    {
        $patient = Patient::factory()->create([
            'clinic_id' => $this->clinic->id,
            'first_name' => 'Old Name',
        ]);

        $updateData = [
            'first_name' => 'New Name',
            'last_name' => $patient->last_name,
            'dob' => $patient->dob,
            'phone' => '0987654321', // new phone
        ];

        $response = $this->actingAs($this->dentist)
            ->patch(route('clinic.patients.update', $patient), $updateData);

        $response->assertRedirect(route('clinic.patients.index'));
        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'first_name' => 'New Name',
            'phone' => '0987654321',
        ]);
    }

    public function test_dentist_can_view_own_patients_only()
    {
        $ownPatient = Patient::factory()->create(['clinic_id' => $this->clinic->id]);

        $otherClinic = Clinic::factory()->create();
        $otherPatient = Patient::factory()->create(['clinic_id' => $otherClinic->id]);

        $response = $this->actingAs($this->dentist)->get(route('clinic.patients.index'));

        $response->assertStatus(200);

        // Inertia testing checking if props contains our patient but not the other
        $response->assertSee($ownPatient->first_name);
        $response->assertDontSee($otherPatient->first_name);

        // Also test direct access via show
        $showResponseList = $this->actingAs($this->dentist)->get(route('clinic.patients.show', $otherPatient));
        $showResponseList->assertStatus(403);
    }
}
