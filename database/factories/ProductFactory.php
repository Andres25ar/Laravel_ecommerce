<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(4, true),       //genera 4 palabras aleatorias falsas para ser el nombre del produccto
            'description' => fake()->paragraph(3),  //descripcion falsa de 3 parrafos
            'inclusions' => fake()->sentence(6),     //oracion de 6 palabras para los elementos que incluyen cada producto
            'price' => fake()->randomFloat(2, 10, 2000),    //real de 2 decimales entre 10 y 2000
            'stock' => fake()->numberBetween(0, 100),
            //asigna un vendedor de manera aleatoria (id del rol vendedor es 2)
            'seller_id' => User::where('role_id', 2)->inRandomOrder()->first()->id,
            //asigna una categoria aleatoria
            'category_id' => Category::inRandomOrder()->first()->id,
        ];
    }
}
