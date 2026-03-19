<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreatmentPlanStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'treatment_plan_id',
        'order_id',
        'sort_order',
        'title',
        'description',
        'status',
        'cost',
        'scheduled_date',
        'completed_at',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'scheduled_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function treatmentPlan()
    {
        return $this->belongsTo(TreatmentPlan::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
