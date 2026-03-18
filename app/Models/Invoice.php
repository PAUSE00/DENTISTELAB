<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'clinic_id',
        'lab_id',
        'order_id',
        'amount',
        'tax',
        'total',
        'status',
        'due_date',
        'paid_at',
        'pdf_path',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
