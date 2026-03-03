<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'first_name',
        'last_name',
        'dob',
        'phone',
        'email',
        'external_id',
        'medical_notes',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
