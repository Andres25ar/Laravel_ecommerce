<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's middleware aliases.
     *
     * Aliases may be used to conveniently assign middleware to routes and groups.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        // ... otros aliases ...
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        //'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

        /*'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,*/

        // --- MIDDLEWARES DE SPATIE ---
        // Estos alias ya vienen pre-registrados por la librería Spatie,
        // por lo que no necesitas añadirlos, pero es así como funcionan.
        // 'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        // 'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        // 'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
    ];
}