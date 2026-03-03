<?php

namespace App\Enums;

enum OrderStatus: string
{
    case New = 'new';
    case InProgress = 'in_progress';
    case Fitting = 'fitting';
    case Finished = 'finished';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Rejected = 'rejected';
    case Archived = 'archived';
    case Cancelled = 'cancelled';

    /**
     * Get the human-readable label.
     */
    public function label(): string
    {
        return match ($this) {
            self::New => 'Nouvelle',
            self::InProgress => 'En cours',
            self::Fitting => 'Essayage',
            self::Finished => 'Terminée',
            self::Shipped => 'Expédiée',
            self::Delivered => 'Livrée',
            self::Rejected => 'Rejetée',
            self::Archived => 'Archivée',
            self::Cancelled => 'Annulée',
        };
    }

    /**
     * Get the allowed transitions from this status.
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::New => [self::InProgress, self::Rejected, self::Cancelled],
            self::InProgress => [self::Fitting, self::Finished],
            self::Fitting => [self::Finished],
            self::Finished => [self::Shipped],
            self::Shipped => [self::Delivered],
            self::Delivered => [self::Archived],
            self::Rejected => [self::Archived, self::Cancelled],
            self::Archived => [],
            self::Cancelled => [],
        };
    }

    /**
     * Check if this status can transition to the given status.
     */
    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions());
    }

    /**
     * Get the color config for frontend rendering.
     */
    public function color(): string
    {
        return match ($this) {
            self::New => 'amber',
            self::InProgress => 'blue',
            self::Fitting => 'purple',
            self::Finished => 'emerald',
            self::Shipped => 'indigo',
            self::Delivered => 'green',
            self::Rejected => 'red',
            self::Archived => 'gray',
            self::Cancelled => 'red',
        };
    }
}
