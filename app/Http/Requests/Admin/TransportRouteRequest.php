<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TransportRouteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'name' => [$required, 'string', 'max:255'],
            'origin' => [$required, 'string', 'max:255'],
            'destination' => [$required, 'string', 'max:255'],
            'distance_km' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'estimated_time' => ['sometimes', 'nullable', 'string', 'max:255'],
            'base_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:active,inactive'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
