<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            'role_id' => 3, //3 es el id del rol administrador
        ]);

        //crear 5 vendedores
        User::factory(5)->create([
            'role_id' => 2, //2 es el id del rol vendedor 
        ]);

        //crear 20 compradores
        User::factory(20)->create();    //por defecto cada usuario se crea con el rol de comprador
    }
}
