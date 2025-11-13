<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTripRequest extends FormRequest
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
        return [
            'status' => ['sometimes', 'in:requested,accepted,in_progress,completed,cancelled'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'driver_id' => ['sometimes', 'nullable', 'exists:users,id'],
        ];
    }
}
