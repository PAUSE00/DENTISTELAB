<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'lab_id',
        'name',
        'description',
        'price',
        'production_days',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
