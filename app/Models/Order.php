<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'lab_id',
        'patient_id',
        'service_id',
        'status',
        'priority',
        'due_date',
        'teeth',
        'shade',
        'material',
        'instructions',
        'price',
        'final_price',
        'payment_status',
        'rejection_reason',
        'invoice_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'teeth' => 'array',
        'price' => 'decimal:2',
        'final_price' => 'decimal:2',
        'status' => OrderStatus::class,
        'payment_status' => PaymentStatus::class,
    ];

    protected $appends = [
        'is_overdue',
        'days_remaining',
    ];

    // ─── Relationships ────────────────────────────────────

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function files()
    {
        return $this->hasMany(OrderFile::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function history()
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at', 'asc');
    }

    public function notes()
    {
        return $this->hasMany(OrderNote::class)->orderBy('created_at', 'desc');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    // ─── Scopes ───────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [OrderStatus::Archived, OrderStatus::Rejected]);
    }

    public function scopeArchived($query)
    {
        return $query->where('status', OrderStatus::Archived);
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', '!=', PaymentStatus::Paid);
    }

    // ─── Helpers ──────────────────────────────────────────

    public function getIsOverdueAttribute(): bool
    {
        return $this->isOverdue();
    }

    public function getDaysRemainingAttribute(): int
    {
        return $this->daysRemaining();
    }

    /**
     * Check if this order can transition to the given status.
     */
    public function canTransitionTo(OrderStatus $target): bool
    {
        return $this->status->canTransitionTo($target);
    }

    /**
     * Transition order to a new status.
     *
     * @throws \InvalidArgumentException
     */
    public function transitionTo(OrderStatus $target, int $changedByUserId, ?string $reason = null): void
    {
        if (! $this->canTransitionTo($target)) {
            throw new \InvalidArgumentException(
                "Cannot transition from '{$this->status->value}' to '{$target->value}'."
            );
        }

        if ($target === OrderStatus::Rejected && empty($reason)) {
            throw new \InvalidArgumentException(
                'A rejection reason is required when rejecting an order.'
            );
        }

        $this->update([
            'status' => $target,
            'rejection_reason' => $target === OrderStatus::Rejected ? $reason : $this->rejection_reason,
        ]);

        $this->history()->create([
            'status' => $target->value,
            'changed_by_user_id' => $changedByUserId,
        ]);

        \App\Events\OrderStatusUpdated::dispatch($this);
    }

    /**
     * Check if the order is overdue.
     */
    public function isOverdue(): bool
    {
        if (! $this->due_date) {
            return false;
        }

        /** @var \Illuminate\Support\Carbon $dueDate */
        $dueDate = $this->due_date;

        return $dueDate->isPast()
            && ! in_array($this->status, [OrderStatus::Delivered, OrderStatus::Archived]);
    }

    /**
     * Get days remaining until due date.
     */
    public function daysRemaining(): int
    {
        if (! $this->due_date) {
            return 0;
        }

        return max(0, (int) now()->diffInDays($this->due_date, false));
    }

    /**
     * Check if the order can be archived.
     */
    public function canBeArchived(): bool
    {
        return in_array($this->status, [OrderStatus::Delivered, OrderStatus::Rejected]);
    }
}
