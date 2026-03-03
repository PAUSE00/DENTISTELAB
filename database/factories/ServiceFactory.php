<?php

namespace Database\Factories;

use App\Models\Lab;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $services = [
            ['name' => 'Couronne Zircone', 'price' => 1500],
            ['name' => 'Couronne Céramo-Métallique', 'price' => 900],
            ['name' => 'Bridge 3 éléments', 'price' => 3500],
            ['name' => 'Facette Céramique', 'price' => 2000],
            ['name' => 'Inlay/Onlay', 'price' => 1200],
            ['name' => 'Prothèse Amovible Complète', 'price' => 4000],
            ['name' => 'Prothèse Amovible Partielle', 'price' => 2500],
            ['name' => 'Gouttière Orthodontique', 'price' => 1800],
            ['name' => 'Implant Pilier', 'price' => 2200],
            ['name' => 'Couronne sur Implant', 'price' => 2800],
        ];

        $svc = fake()->randomElement($services);

        return [
            'lab_id' => Lab::factory(),
            'name' => $svc['name'],
            'description' => 'Service de prothèse dentaire de haute qualité.',
            'price' => $svc['price'] + fake()->numberBetween(-200, 200),
            'production_days' => fake()->numberBetween(3, 14),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn() => ['is_active' => false]);
    }
}
