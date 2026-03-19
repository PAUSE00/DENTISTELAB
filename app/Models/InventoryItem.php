<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'clinic_id',
        'name',
        'category',
        'quantity',
        'unit',
        'min_threshold',
        'supplier',
        'price_per_unit',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
