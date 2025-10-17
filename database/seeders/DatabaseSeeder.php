<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //llamar a los metodos run de los demas seeders
        $this->call([
            //primero los seeder sin dependencias o realiciones con los demas
            CategorySeeder::class,
            TagSeeder::class,
            //sefundo los user con sus roles
            UserSeeder::class,
            //ultimo los productos que tienen relacion con todos los demas seeders
            ProductSeeder::class,
        ]);
    }
}

//php artisan migrate:fresh --seed