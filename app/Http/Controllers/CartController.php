<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart :: where ('user_id', Auth :: id())
                ->has('product')
                ->with('product.images')
                ->get()
                ->map(function ($item){
                    //$item->product_image_url = $item->product_images_first()?->image_url ?? null;
                    $item->product_image_url = $item->product->images->first()?->image_url ?? null;
                    return $item;
                });
        return Inertia :: render('cart/index', ['cartItems' => $cartItems]);
    }

    /**
     * Añade un producto al carrito.
     */
    public function add(Product $product)
    {
        // Validar que haya stock
        if ($product->stock <= 0) {
            return redirect()->back()->with('error', 'Producto sin stock.');
        }

        // Buscar si el item ya está en el carrito
        $cartItem = Cart::where('user_id', Auth::id())
                        ->where('product_id', $product->id)
                        ->first();

        if ($cartItem) {
            // Si ya existe, incrementar la cantidad (si el stock lo permite)
            if ($product->stock >= $cartItem->quantity + 1) {
                $cartItem->increment('quantity');
            } else {
                return redirect()->back()->with('error', 'No puedes añadir más de lo que hay en stock.');
            }
        } else {
            // Si no existe, crearlo
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $product->id,
                'quantity' => 1,
            ]);
        }

        return redirect()->back()->with('success', 'Producto añadido al carrito.');
    }

    /**
     * Actualiza la cantidad de un item en el carrito.
     */
    public function update(Request $request, Cart $cart)
    {
        // Autorizar que el item pertenezca al usuario
        if ($cart->user_id !== Auth::id()) {
            abort(403, 'Acción no autorizada.');
        }

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:' . $cart->product->stock],
        ]);

        $quantity = $validated['quantity'];

        if ($quantity == 0) {
            // Si la cantidad es 0, eliminar el item
            $cart->delete();
        } else {
            // Si no, actualizar la cantidad
            $cart->update(['quantity' => $quantity]);
        }

        return redirect()->route('cart.index')->with('success', 'Carrito actualizado.');
    }

    /**
     * Elimina un item del carrito.
     */
    public function destroy(Cart $cart)
    {
        // Autorizar que el item pertenezca al usuario
        if ($cart->user_id !== Auth::id()) {
            abort(403, 'Acción no autorizada.');
        }

        $cart->delete();

        return redirect()->route('cart.index')->with('success', 'Producto eliminado del carrito.');
    }
}
