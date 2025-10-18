<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Resetea los roles y permisos cacheados
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // --- CREAR PERMISOS ---
        // Permisos para Productos
        Permission::create(['name' => 'view products']);
        Permission::create(['name' => 'create products']);
        Permission::create(['name' => 'edit products']);
        Permission::create(['name' => 'delete products']);

        // Permisos para Carrito/Compras
        Permission::create(['name' => 'add to cart']);
        Permission::create(['name' => 'view own orders']);

        // Permisos de Administrador
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'view dashboard']);
        Permission::create(['name' => 'manage categories']);
        Permission::create(['name' => 'manage tags']);

        // --- CREAR ROLES Y ASIGNAR PERMISOS ---

        // Rol: Comprador
        $buyerRole = Role::create(['name' => 'comprador']);
        $buyerRole->givePermissionTo([
            'view products',
            'add to cart',
            'view own orders',
        ]);

        // Rol: Vendedor
        $sellerRole = Role::create(['name' => 'vendedor']);
        $sellerRole->givePermissionTo([
            'view products',
            'create products',
            'edit products',
            'delete products',
            'add to cart',
            'view own orders',
        ]);

        // Rol: Administrador - tiene todos los permisos
        $adminRole = Role::create(['name' => 'administrador']);
        $adminRole->givePermissionTo(Permission::all());
    }
}