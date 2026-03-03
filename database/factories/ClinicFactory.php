<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClinicFactory extends Factory
{
    protected $model = Clinic::class;

    public function definition(): array
    {
        $clinicNames = [
            'Cabinet Dentaire Dr. Alami',
            'Centre Dentaire Casablanca',
            'Clinique du Sourire',
            'Cabinet Dr. Bennani',
            'Dental Care Rabat',
            'Centre Orthodontique Marrakech',
            'Cabinet Dr. El Fassi',
            'Clinique Dentaire Fès',
            'Cabinet Dr. Ouazzani',
            'Dental Studio Tanger',
            'Cabinet Dr. Saidi',
            'Centre Dentaire Agadir',
        ];

        return [
            'name' => fake()->unique()->randomElement($clinicNames),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'is_active' => true,
        ];
    }
}
