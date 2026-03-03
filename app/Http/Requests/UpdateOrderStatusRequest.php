<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        return in_array($this->user()->role, ['lab_owner', 'lab_tech'])
            && $order
            && $order->lab_id === $this->user()->lab_id;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', new Enum(OrderStatus::class)],
            'rejection_reason' => ['required_if:status,rejected', 'nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Le statut est obligatoire.',
            'rejection_reason.required_if' => 'Un motif de rejet est obligatoire.',
        ];
    }
}
