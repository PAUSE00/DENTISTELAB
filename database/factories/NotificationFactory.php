<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        $types = [
            ['type' => 'order_status', 'title' => 'Commande mise à jour', 'body' => 'La commande #%d est passée à "%s".'],
            ['type' => 'new_order', 'title' => 'Nouvelle commande', 'body' => 'Une nouvelle commande #%d a été créée.'],
            ['type' => 'new_message', 'title' => 'Nouveau message', 'body' => 'Vous avez un nouveau message sur la commande #%d.'],
        ];

        $notif = fake()->randomElement($types);
        $orderId = fake()->numberBetween(1, 50);

        return [
            'user_id' => User::factory(),
            'type' => $notif['type'],
            'title' => $notif['title'],
            'body' => sprintf($notif['body'], $orderId, 'en production'),
            'data' => ['order_id' => $orderId],
            'read_at' => fake()->optional(0.4)->dateTimeBetween('-3 days', 'now'),
        ];
    }

    public function unread(): static
    {
        return $this->state(fn() => ['read_at' => null]);
    }

    public function read(): static
    {
        return $this->state(fn() => ['read_at' => now()]);
    }
}
