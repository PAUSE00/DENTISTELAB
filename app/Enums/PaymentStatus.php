<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Partial = 'partial';
    case Paid = 'paid';

    /**
     * Get the human-readable label.
     */
    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Impayée',
            self::Partial => 'Partiellement payée',
            self::Paid => 'Payée',
        };
    }

    /**
     * Get the color for frontend rendering.
     */
    public function color(): string
    {
        return match ($this) {
            self::Unpaid => 'red',
            self::Partial => 'amber',
            self::Paid => 'green',
        };
    }
}
