<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'lab_id',
        'email',
        'token',
        'expires_at',
        'accepted_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    // ─── Relationships ────────────────────────────────────

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    // ─── Scopes ───────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->whereNull('accepted_at')->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->whereNull('accepted_at')->where('expires_at', '<=', now());
    }

    // ─── Helpers ──────────────────────────────────────────

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isAccepted(): bool
    {
        return ! is_null($this->accepted_at);
    }

    public function accept(): void
    {
        $this->update(['accepted_at' => now()]);
    }
}
