<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        return [
            'clinic_id' => Clinic::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'dob' => fake()->dateTimeBetween('-70 years', '-15 years'),
            'phone' => '0' . fake()->numerify('#########'),
            'email' => fake()->optional(0.6)->safeEmail(),
            'external_id' => 'PR-' . fake()->unique()->numerify('####'),
            'medical_notes' => fake()->optional(0.3)->sentence(8),
        ];
    }
}
