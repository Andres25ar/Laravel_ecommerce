<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\User;
use App\Models\Product;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Muestra una lista de los productos del vendedor autenticado.
     */
    public function index()
    {
        $products = Product::where('seller_id', Auth::id())
            ->with('category')
            ->latest()
            ->paginate(10);

        return Inertia::render('Seller/Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo producto.
     */
    public function create()
    {
        return Inertia::render('Seller/Products/Create', [
            'categories' => Category::all(['id', 'name']),
            'tags' => Tag::all(['id', 'name']),
        ]);
    }

    /**
     * Guarda un nuevo producto en la base de datos.
     */
    public function store(StoreProductRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $product = $user->products()->create($request->validated());
        $product->tags()->sync($request->input('tags', []));

        return redirect()->route('seller.products.index')->with('success', 'Producto creado con éxito.');
    }


    /**
     * Muestra el formulario para editar un producto existente.
     */
    public function edit(Product $product)
    {
        // Doble verificación: asegurar que el producto pertenece al vendedor
        if ($product->seller_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Seller/Products/Edit', [
            'product' => $product->load('tags'), // Carga los tags asociados
            'categories' => Category::all(['id', 'name']),
            'tags' => Tag::all(['id', 'name']),
        ]);
    }

    /**
     * Actualiza un producto existente en la base de datos.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());
        $product->tags()->sync($request->input('tags', []));

        return redirect()->route('seller.products.index')->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Elimina un producto de la base de datos.
     */
    public function destroy(Request $request, Product $product)
    {
        if($request->user()->cannot('delete products')){
            abort(403, 'No tienes permisos para esta accion');
        }

        if ($product->seller_id !== Auth::id()) {
            abort(403, 'Accion no autorizada');
        }

        $product->delete();
        return redirect()->route('seller.products.index')->with('success', 'Producto eliminado con éxito.');
    }
}
