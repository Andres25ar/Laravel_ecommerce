<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        //fake genera datos falsos, con unique se asegura que sea una palabra unica
        $name = fake()->unique()->word();
        return [
            'name' => ucfirst($name),   //la primer letra de cada palabra estrá con mayuscula
            'slug' => Str::slug($name), //pone todo en minuscula reemplaza los ' ' por '-'
        ];
    }
}
