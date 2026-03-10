<?php

namespace Tests\Unit;

use App\Enums\OrderStatus;
use PHPUnit\Framework\TestCase;

class OrderStatusTest extends TestCase
{
    public function test_new_can_transition_to_in_progress(): void
    {
        $this->assertTrue(OrderStatus::New->canTransitionTo(OrderStatus::InProgress));
    }

    public function test_new_can_transition_to_rejected(): void
    {
        $this->assertTrue(OrderStatus::New->canTransitionTo(OrderStatus::Rejected));
    }

    public function test_new_can_transition_to_cancelled(): void
    {
        $this->assertTrue(OrderStatus::New->canTransitionTo(OrderStatus::Cancelled));
    }

    public function test_new_cannot_transition_to_delivered(): void
    {
        $this->assertFalse(OrderStatus::New->canTransitionTo(OrderStatus::Delivered));
    }

    public function test_new_cannot_transition_to_shipped(): void
    {
        $this->assertFalse(OrderStatus::New->canTransitionTo(OrderStatus::Shipped));
    }

    public function test_in_progress_can_transition_to_fitting(): void
    {
        $this->assertTrue(OrderStatus::InProgress->canTransitionTo(OrderStatus::Fitting));
    }

    public function test_in_progress_can_transition_to_finished(): void
    {
        $this->assertTrue(OrderStatus::InProgress->canTransitionTo(OrderStatus::Finished));
    }

    public function test_in_progress_cannot_transition_to_delivered(): void
    {
        $this->assertFalse(OrderStatus::InProgress->canTransitionTo(OrderStatus::Delivered));
    }

    public function test_fitting_can_transition_to_finished(): void
    {
        $this->assertTrue(OrderStatus::Fitting->canTransitionTo(OrderStatus::Finished));
    }

    public function test_fitting_cannot_transition_to_shipped(): void
    {
        $this->assertFalse(OrderStatus::Fitting->canTransitionTo(OrderStatus::Shipped));
    }

    public function test_finished_can_transition_to_shipped(): void
    {
        $this->assertTrue(OrderStatus::Finished->canTransitionTo(OrderStatus::Shipped));
    }

    public function test_shipped_can_transition_to_delivered(): void
    {
        $this->assertTrue(OrderStatus::Shipped->canTransitionTo(OrderStatus::Delivered));
    }

    public function test_delivered_can_transition_to_archived(): void
    {
        $this->assertTrue(OrderStatus::Delivered->canTransitionTo(OrderStatus::Archived));
    }

    public function test_archived_cannot_transition_anywhere(): void
    {
        foreach (OrderStatus::cases() as $target) {
            $this->assertFalse(
                OrderStatus::Archived->canTransitionTo($target),
                "Archived should not transition to {$target->value}"
            );
        }
    }

    public function test_cancelled_cannot_transition_anywhere(): void
    {
        foreach (OrderStatus::cases() as $target) {
            $this->assertFalse(
                OrderStatus::Cancelled->canTransitionTo($target),
                "Cancelled should not transition to {$target->value}"
            );
        }
    }

    public function test_rejected_can_transition_to_archived(): void
    {
        $this->assertTrue(OrderStatus::Rejected->canTransitionTo(OrderStatus::Archived));
    }

    public function test_rejected_can_transition_to_cancelled(): void
    {
        $this->assertTrue(OrderStatus::Rejected->canTransitionTo(OrderStatus::Cancelled));
    }

    public function test_label_returns_translation_key(): void
    {
        // label() calls __() which returns the key when no translation is loaded
        $label = OrderStatus::New->label();
        $this->assertIsString($label);
        $this->assertNotEmpty($label);
    }

    public function test_color_returns_string_for_all_statuses(): void
    {
        foreach (OrderStatus::cases() as $status) {
            $color = $status->color();
            $this->assertIsString($color, "Color for {$status->value} should be a string");
            $this->assertNotEmpty($color, "Color for {$status->value} should not be empty");
        }
    }

    public function test_allowed_transitions_returns_array(): void
    {
        foreach (OrderStatus::cases() as $status) {
            $transitions = $status->allowedTransitions();
            $this->assertIsArray($transitions, "Transitions for {$status->value} should be an array");
        }
    }
}
