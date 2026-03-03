<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'priority' => $this->priority,
            'due_date' => $this->due_date?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Clinical data
            'teeth' => $this->teeth,
            'shade' => $this->shade,
            'material' => $this->material,
            'instructions' => $this->instructions,

            // Financial
            'price' => (float) $this->price,
            'final_price' => $this->final_price ? (float) $this->final_price : null,
            'payment_status' => $this->payment_status?->value,
            'payment_status_label' => $this->payment_status?->label(),

            // Rejection
            'rejection_reason' => $this->rejection_reason,

            // Computed
            'is_overdue' => $this->isOverdue(),
            'days_remaining' => $this->daysRemaining(),
            'can_be_archived' => $this->canBeArchived(),

            // Relationships
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'lab' => $this->whenLoaded('lab', fn() => [
                'id' => $this->lab->id,
                'name' => $this->lab->name,
            ]),
            'clinic' => $this->whenLoaded('clinic', fn() => [
                'id' => $this->clinic->id,
                'name' => $this->clinic->name,
            ]),
            'service' => $this->whenLoaded('service', fn() => [
                'id' => $this->service->id,
                'name' => $this->service->name,
                'price' => (float) $this->service->price,
            ]),
            'files' => OrderFileResource::collection($this->whenLoaded('files')),
            'history' => $this->whenLoaded(
                'history',
                fn() =>
                $this->history->map(fn($h) => [
                    'id' => $h->id,
                    'status' => $h->status,
                    'created_at' => $h->created_at->toIso8601String(),
                ])
            ),
        ];
    }
}
