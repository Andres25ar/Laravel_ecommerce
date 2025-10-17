<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Por ahora, cualquiera puede crear. Luego aquí puedes poner lógica
        // para asegurar que solo los vendedores puedan crear productos.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
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
            'tags' => 'nullable|array', // Valida que 'tags' sea un arreglo
            'tags.*' => 'exists:tags,id', // Valida que cada id en el arreglo exista en la tabla 'tags'
        ];
    }
}
