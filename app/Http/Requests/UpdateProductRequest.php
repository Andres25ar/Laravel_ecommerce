<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //permisos asignados a los vendedores en el archivo /database/seeders/RolesAndPermissionsSeeders.php
        //retorna true si el usuario tiene los permisos para crear productos
        //ademas se asegura que solo el vendedor de ese producto pueda editarlos
        return $this->user()->can('edit products') && $this->user()->id === $this->product->seller_id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'inclusions' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ];
    }
}
