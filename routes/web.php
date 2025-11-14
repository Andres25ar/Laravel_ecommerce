<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Middleware\RoleMiddleware;
use Inertia\Inertia;


// --- RUTAS PÚBLICAS (Cualquiera puede verlas) ---
Route::get('/', [ProductController::class, 'index'])->name('home');


// --- RUTAS QUE REQUIEREN AUTENTICACIÓN ---
//solo los usuarios registrados pueden acceder
///Route::middleware(['auth', 'verified'])->group(function () 
Route::middleware(['auth'])->group(function () 
{
    //ruta de detalles de productos
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

    //dashboard con logica de roles
    Route::get('/dashboard', function () {
        //guarda el nivel de autorizacion de los usuarios
        //$user = Auth::user();
        $user = auth()->user();

        if($user->hasRole('administrador')){
            return redirect()->route('admin.categories.index');
        }

        if($user->hasRole('vendedor')){
            return redirect()->route('seller.products.index');
        }

    //si no es comprador va al inicio
    //return redirect()->route('home');
    return redirect()->route('orders.index');

    })->name('dashboard');

    // --- RUTAS DE LOS COMPRADORES --- 
    Route::get('/my-orders', [OrderController :: class, 'index'])
        ->middleware('verified')    //verifica que este autenticado
        ->name('orders.index');

    // --- RUTAS DEL CARRITO DE COMPRAS ---
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    // --- RUTAS PARA REALIZAR LOS PAGOS ---
    Route::get('/checkout', [CheckoutController::class, 'index'])
        ->middleware('verified')
        ->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])
        ->middleware('verified')
        ->name('checkout.store');

    // --- RUTAS DE VENDEDOR (Protegidas) ---
    //Route::middleware('role:vendedor')
    Route::middleware(RoleMiddleware::class . ':vendedor')
        ->prefix('seller') //URL base será /seller/...
        ->name('seller.') //nombres de ruta serán seller....
        ->group(function () {
            Route::resource('products', SellerProductController::class);
            Route::get('orders', [SellerOrderController::class, 'index'])->name('orders.index');
            Route::put('orders/{order}', [SellerOrderController::class, 'update'])->name('orders.update');
        });


    // --- RUTAS DE ADMINISTRACIÓN (Protegidas) ---
    //Route::middleware('role:administrador')
    Route::middleware(RoleMiddleware::class . ':administrador')
        ->prefix('admin') // URL base será /admin/...
        ->name('admin.') // Nombres de ruta serán admin....
        ->group(function () {
            Route::resource('categories', AdminCategoryController::class);
            Route::resource('tags', AdminTagController::class);
            Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
            Route::put('users/{user}/role',[AdminUserController::class, 'updateRole'])->name('users.updateRole');
            Route::post('users/{user}/suspend',[AdminUserController::class, 'suspend']) ->name('users.suspend');
            Route::post('users/{user}/restore',[AdminUserController::class, 'restore']) ->name('users.restore');
        });
});


// Rutas de autenticación de Breeze/Fortify, para registrarse o iniciar sesion
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';