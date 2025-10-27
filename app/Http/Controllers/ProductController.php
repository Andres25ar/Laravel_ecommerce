<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Muestra una lista pública de todos los productos.
     */
    public function index()
    {
        $products = Product::with(['category', 'seller'])->paginate(12);

        return Inertia::render('products/index', [
            'products' => $products
        ]);
    }

    /**
     * Muestra el detalle de un producto específico.
     * Esta ruta está protegida por middleware, por lo que solo usuarios
     * autenticados llegarán aquí.
     */
    public function show(Product $product)
    {
        // Cargamos las relaciones que queramos mostrar en la vista de detalle
        $product->load(['category', 'seller', 'tags', 'images']);

        return Inertia::render('products/show', [
            'product' => $product
        ]);
    }
}