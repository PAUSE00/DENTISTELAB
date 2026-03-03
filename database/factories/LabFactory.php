<?php

namespace Database\Factories;

use App\Models\Lab;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LabFactory extends Factory
{
    protected $model = Lab::class;

    public function definition(): array
    {
        $labNames = [
            'ProDent Lab',
            'Smile Factory',
            'DentaCraft',
            'StarDent Lab',
            'PrecisionDent',
            'LabElite Dental',
            'CrownMasters',
            'ZircoTech Lab',
            'DentaFusion',
            'NovaDent Lab',
            'AlphaSmile Lab',
            'BrightDent',
        ];

        return [
            'name' => fake()->unique()->randomElement($labNames),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'description' => fake()->sentence(10),
            'terms' => 'Conditions générales de vente : paiement sous 30 jours.',
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn() => ['is_active' => false]);
    }
}
