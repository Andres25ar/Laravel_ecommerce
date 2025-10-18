<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// --- RUTAS PÚBLICAS (Cualquiera puede verlas) ---
Route::get('/', [ProductController::class, 'index'])->name('home');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');


// --- RUTAS QUE REQUIEREN AUTENTICACIÓN ---
Route::middleware([
    'auth', // 'auth:sanctum' y 'verified' suelen venir con Breeze/Jetstream, 'auth' es más general
    'verified',
])->group(function () {

    Route::get('/dashboard', function () {
        // Redirigir al panel correspondiente según el rol del usuario
        //si no funciona probar Auth::user()->isAdmin())
        if (auth()->user()->isAdmin()) {
            // Un admin podría tener su propio dashboard en el futuro
            // Por ahora, lo mandamos a categorías
            return redirect()->route('admin.categories.index');
        }
        if (auth()->user()->isSeller()) {
            return redirect()->route('seller.products.index');
        }
        // Si es comprador, se queda en un dashboard simple
        return Inertia::render('Dashboard');
    })->name('dashboard');


    // --- RUTAS DE VENDEDOR (Protegidas) ---
    Route::middleware('isSeller')
        ->prefix('seller') // URL base será /seller/...
        ->name('seller.') // Nombres de ruta serán seller....
        ->group(function () {
            Route::resource('products', SellerProductController::class);
        });


    // --- RUTAS DE ADMINISTRACIÓN (Protegidas) ---
    Route::middleware('isAdmin')
        ->prefix('admin') // URL base será /admin/...
        ->name('admin.') // Nombres de ruta serán admin....
        ->group(function () {
            Route::resource('categories', AdminCategoryController::class);
            Route::resource('tags', AdminTagController::class);
        });
});


// Rutas de autenticación de Breeze/Fortify
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';