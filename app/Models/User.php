<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'lab_id',
        'clinic_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    /**
     * Get orders associated with this user's lab.
     */
    public function labOrders()
    {
        return $this->hasMany(Order::class, 'lab_id', 'lab_id');
    }

    /**
     * Get orders associated with this user's clinic.
     */
    public function clinicOrders()
    {
        return $this->hasMany(Order::class, 'clinic_id', 'clinic_id');
    }

    /**
     * Get orders for this user's context.
     *
     * Use explicit scopes instead of a conditional relationship:
     *   - Lab users:    $user->labOrders()
     *   - Clinic users: $user->clinicOrders()
     */
    public function scopeWithContextOrders($query)
    {
        // This scope is a documentation placeholder.
        // Use labOrders() / clinicOrders() directly on the User instance.
        return $query;
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if the user is a lab team member.
     */
    public function isLabMember(): bool
    {
        return in_array($this->role, ['lab_owner', 'lab_tech']);
    }

    /**
     * Check if the user is a clinic team member.
     */
    public function isClinicMember(): bool
    {
        return in_array($this->role, ['dentist', 'clinic_staff']);
    }

    /**
     * Scope: only lab team members.
     */
    public function scopeLabTeam($query)
    {
        return $query->whereIn('role', ['lab_owner', 'lab_tech']);
    }

    /**
     * Scope: only clinic team members.
     */
    public function scopeClinicTeam($query)
    {
        return $query->whereIn('role', ['dentist', 'clinic_staff']);
    }
}
