<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return in_array($this->user()->role, ['dentist', 'clinic_staff']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Step 1: Basic Info
            'patient_id' => 'required|exists:patients,id',
            'lab_id' => 'required|exists:labs,id',
            'service_id' => 'required|exists:services,id', // Ideally validate service belongs to lab
            'due_date' => 'required|date|after:today',
            'priority' => 'required|in:normal,urgent',

            // Step 2: Technical Specs
            'teeth' => 'required|array', // Expecting array of tooth numbers
            'teeth.*' => 'integer|between:11,48', // FDI notation validation
            'shade' => 'required|string|max:50',
            'material' => 'required|string|max:100', // e.g., Zirconia, E-max
            'instructions' => 'nullable|string|max:2000',

            // Step 3: Files
            'files' => 'nullable|array',
            'files.*' => 'file|max:51200', // 50MB max
        ];
    }
}
