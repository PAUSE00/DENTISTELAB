<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()->role, ['dentist', 'clinic_staff']);
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'dob' => ['required', 'date', 'before:today'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'external_id' => ['nullable', 'string', 'max:100'],
            'medical_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom est obligatoire.',
            'dob.required' => 'La date de naissance est obligatoire.',
            'dob.before' => 'La date de naissance doit être dans le passé.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
        ];
    }
}
