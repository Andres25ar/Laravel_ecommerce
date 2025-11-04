<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //crear un admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'adminuser@example.com',
            'password' => Hash::make('admin123'),
        ])->assignRole('administrador');

        //crear un seller
        User::factory()->create([
            'name' => 'Vendedor de Prueba',
            'email' => 'selleruser@example.com',
            'password' => Hash::make('seller123'), // Contraseña fácil de recordar
        ])->assignRole('vendedor');

        //crear 5 vendedores
        User::factory(5)->create()->each(function ($user){
            $user->assignRole('vendedor');
        });

        //crear 20 compradores
        User::factory(20)->create()->each(function ($user){
            $user->assignRole('comprador');
        });
    }
}
