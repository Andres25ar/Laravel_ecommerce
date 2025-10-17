<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * Basado en la página 12 del PDF.
     */
    public function index()
    {
        // Obtenemos los productos con sus categorías y vendedores para optimizar.
        // Paginamos para no mostrar los 60 productos de golpe.
        $products = Product::with(['category', 'seller'])->paginate(12);

        // Renderiza el componente React 'Products/Index' y le pasa los productos.
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }
}

