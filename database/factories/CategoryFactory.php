<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str; //se usa para el slug donde hay un metodo que toma el nombre de la categoria y crea una version para url

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        //fake genera datos falsos, con unique se asegura que sean unicos y con words(2, true) crea 2 palabras diferentes 
        $name = fake()->unique()->words(2, true);
        return [
            'name' => ucfirst($name),   //la primer letra de cada palabra estrá con mayuscula
            'slug' => Str::slug($name), //pone todo en minuscula reemplaza los ' ' por '-'
        ];
    }
}
