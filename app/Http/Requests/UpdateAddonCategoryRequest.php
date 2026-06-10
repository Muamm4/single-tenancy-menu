<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddonCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'min_select' => 'required|integer|min:0',
            'max_select' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];
    }
}
