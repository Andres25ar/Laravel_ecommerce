<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //crear 60 productos
        Product::factory(60)
            ->create()
            ->each(function ($product){
                /*esto se repite para cada producto creado *60 veces*/
                //de manera random genera entre 3 y 7 id de tags
                $tags = Tag::inRandomOrder()->take(rand(3, 7))->pluck('id');
                //a la realcion tags del modelo de productos le asigna o guarda la lista de tags obtenidas en la linea anterior
                $product->tags()->attach($tags);
            });
    }
}
