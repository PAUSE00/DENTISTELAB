<?php

namespace Database\Factories;

use App\Models\Invitation;
use App\Models\Lab;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InvitationFactory extends Factory
{
    protected $model = Invitation::class;

    public function definition(): array
    {
        return [
            'lab_id' => Lab::factory(),
            'email' => fake()->unique()->safeEmail(),
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
            'accepted_at' => null,
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn() => [
            'accepted_at' => fake()->dateTimeBetween('-5 days', 'now'),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn() => [
            'expires_at' => fake()->dateTimeBetween('-10 days', '-1 day'),
        ]);
    }
}
