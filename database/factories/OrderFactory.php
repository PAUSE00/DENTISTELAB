<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Clinic;
use App\Models\Lab;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $shades = ['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'B3', 'C1', 'C2', 'D2', 'D3'];
        $materials = ['Zircone', 'Emax', 'Céramo-Métallique', 'Composite', 'PMMA', 'Titane', 'Chrome-Cobalt'];
        $priorities = ['normal', 'urgent'];

        // Pick random teeth (1-8 teeth from the FDI numbering)
        $allTeeth = array_merge(
            range(11, 18),
            range(21, 28),
            range(31, 38),
            range(41, 48)
        );
        $selectedTeeth = fake()->randomElements($allTeeth, fake()->numberBetween(1, 6));
        sort($selectedTeeth);

        $price = fake()->randomFloat(2, 500, 5000);

        return [
            'clinic_id' => Clinic::factory(),
            'lab_id' => Lab::factory(),
            'patient_id' => Patient::factory(),
            'service_id' => Service::factory(),
            'status' => fake()->randomElement(OrderStatus::cases())->value,
            'priority' => fake()->randomElement($priorities),
            'due_date' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'teeth' => $selectedTeeth,
            'shade' => fake()->randomElement($shades),
            'material' => fake()->randomElement($materials),
            'instructions' => fake()->optional(0.4)->sentence(12),
            'price' => $price,
            'final_price' => fake()->optional(0.3)->randomFloat(2, $price * 0.8, $price * 1.1),
            'payment_status' => fake()->randomElement(PaymentStatus::cases())->value,
        ];
    }

    public function status(OrderStatus $status): static
    {
        return $this->state(fn() => ['status' => $status->value]);
    }

    public function paid(): static
    {
        return $this->state(fn() => ['payment_status' => PaymentStatus::Paid->value]);
    }

    public function unpaid(): static
    {
        return $this->state(fn() => ['payment_status' => PaymentStatus::Unpaid->value]);
    }

    public function urgent(): static
    {
        return $this->state(fn() => ['priority' => 'urgent']);
    }
}
