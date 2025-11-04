<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest; // Usa el request correcto
use App\Http\Requests\UpdateProductRequest; // Usa el request correcto
use App\Models\Product;
use App\Models\Category; // Para pasarlas al formulario
use App\Models\Tag;       // Para pasarlas al formulario
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Para obtener el ID del vendedor
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the seller's products.
     */
    public function index()
    {
        // Obtenemos solo los productos del vendedor logueado
        $products = Product::where('seller_id', Auth::id())
            ->with('category') // Cargar categoría para mostrarla
            ->latest()
            ->paginate(10);

        return Inertia::render('seller/products/index', [ // Nombre en minúsculas
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('seller/products/create', [ // Nombre en minúsculas
            'categories' => Category::all(['id', 'name']), // Pasa todas las categorías
            'tags' => Tag::all(['id', 'name']),          // Pasa todos los tags
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request)
    {
        // Creamos el producto asociándolo al vendedor actual
        $product = Product::create(array_merge($request->validated(), [
            'seller_id' => Auth::id(),
        ]));

        // Sincronizamos los tags (si se enviaron)
        if ($request->has('tags')) {
            $product->tags()->sync($request->input('tags', []));
        }

        // Aquí iría la lógica para guardar imágenes si las manejas

        return redirect()->route('seller.products.index')->with('success', 'Producto creado.');
    }


    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        // Verificación extra (aunque el FormRequest ya lo hace en update)
        // Asegura que el vendedor solo pueda editar SUS productos
        if ($product->seller_id !== Auth::id()) {
            abort(403);
        }

        // Cargar los tags asociados a este producto
        $product->load('tags:id');

        return Inertia::render('seller/products/edit', [ // Nombre en minúsculas
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
            'tags' => Tag::all(['id', 'name']),
            // Pasamos los IDs de los tags actuales del producto
            'currentTagIds' => $product->tags->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        // El FormRequest ya validó la autorización y los datos
        $product->update($request->validated());

        // Sincronizamos los tags
        if ($request->has('tags')) {
            $product->tags()->sync($request->input('tags', []));
        } else {
            // Si no se envía 'tags', asumimos que se quieren quitar todos
            $product->tags()->detach();
        }

        // Aquí iría la lógica para actualizar/eliminar imágenes

        return redirect()->route('seller.products.index')->with('success', 'Producto actualizado.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product) // No necesitamos Request aquí si usamos Route Model Binding
    {
        // --- VERIFICACIÓN DE AUTORIZACIÓN MANUAL ---
        // Asegura que el vendedor solo pueda borrar SUS productos
        if ($product->seller_id !== Auth::id()) {
            abort(403, 'No tienes permiso para eliminar este producto.');
        }
        // --- FIN VERIFICACIÓN ---

        // Aquí iría la lógica para eliminar imágenes asociadas si es necesario

        $product->delete();

        return redirect()->route('seller.products.index')->with('success', 'Producto eliminado.');
    }
}
