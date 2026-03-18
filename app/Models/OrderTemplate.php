<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'clinic_id',
        'lab_id',
        'service_id',
        'teeth_data',
        'notes',
        'color',
    ];

    protected $casts = [
        'teeth_data' => 'array',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
