<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Muestra todas las categorías.
     * Controlador para las rutas y vistas publicas.
     */
    public function index()
    {
        // Esto podría ser para una página que liste todas las categorías
        return Inertia::render('Categories/index', [
            'categories' => Category::all(),
        ]);
    }
}
