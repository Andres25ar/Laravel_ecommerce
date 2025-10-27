<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //ver el archivo /database/seeders/RolesAndPermissionsSeeder.php
        //return $this->user()->can('manage categories'); //verdadero si le usuario puede gestionar las categorias
        return $this->user()->hasRole('administrador');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category')->id;
        return [
            'name' => 'required|string|max:255|unique:categories,name,' . $categoryId,
        ];
    }
}
