<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function index()
    {
        // Obtener los items del carrito para mostrar el total
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Tu carrito está vacío.');
        }

        // Calcular el total
        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // Simulación de costos de envío, etc.
        $shippingCost = $subtotal > 0 ? 2000 : 0; // Mismo cálculo que en cart/index.tsx
        $total = $subtotal + $shippingCost;

        return Inertia::render('checkout/index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shippingCost' => $shippingCost,
            'total' => $total,
        ]);
    }

    /**
     * Procesa la simulación de pago y crea la orden.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $cartItems = Cart::where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('home')->with('error', 'Tu carrito está vacío.');
        }

        // --- 1. VALIDACIÓN (Formulario de Tarjeta y Dirección) ---
        $request->validate([
            // Simulación de tarjeta
            'card_number' => 'required|string|digits:16',
            'expiry_date' => ['required', 'string', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            //'expiry_date' => 'required|string|regex:/^(0[1-9]|1[0-2])\/\d{2}$/', // Formato MM/YY
            'cvv' => 'required|string|digits:3',
            'card_name' => 'required|string|max:255',
            // Dirección
            'shipping_address_line_1' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:255',
            'shipping_state' => 'required|string|max:255',
            'shipping_postal_code' => 'required|string|max:20',
        ]);

        // --- 2. LÓGICA DE NEGOCIO (Crear la Orden) ---
        // Usamos una transacción para asegurar que todo salga bien o nada.
        try {
            DB::beginTransaction();

            // Calcular el total (¡Importante! recalcular en el backend)
            $total = $cartItems->sum(function ($item) {
                // Opcional: Validar stock aquí
                if ($item->quantity > $item->product->stock) {
                    throw ValidationException::withMessages([
                        'cart' => 'El producto ' . $item->product->name . ' ya no tiene stock suficiente.',
                    ]);
                }
                return $item->product->price * $item->quantity;
            });

            $total += $total > 0 ? 2000 : 0; // Añadir costo de envío

            // 1. Crear la Orden
            $order = Order::create([
                'buyer_id' => $user->id,
                'total_amount' => $total,
                'payment_method' => 'Tarjeta (Simulada)',
                'status' => 'paid', // ¡Estado pagado!
                // Guardar dirección
                'shipping_address_line_1' => $request->shipping_address_line_1,
                'shipping_city' => $request->shipping_city,
                'shipping_state' => $request->shipping_state,
                'shipping_postal_code' => $request->shipping_postal_code,
            ]);

            // 2. Mover items del carrito a la orden y actualizar stock
            foreach ($cartItems as $item) {
                // Añadir a la tabla 'order_product'
                $order->products()->attach($item->product_id, [
                    'quantity' => $item->quantity,
                    'price' => $item->product->price, // Precio al momento de la compra
                ]);

                // Descontar el stock
                $item->product->decrement('stock', $item->quantity);
            }

            // 3. Vaciar el carrito
            Cart::where('user_id', $user->id)->delete();

            // 4. Confirmar la transacción
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack(); // Deshacer todo si algo falla
            // Si es un error de validación de stock, devuélvelo
            if ($e instanceof ValidationException) {
                return redirect()->route('cart.index')->withErrors($e->errors());
            }
            // Para cualquier otro error
            return redirect()->route('cart.index')->with('error', 'Error al procesar el pago. Intenta de nuevo.');
        }

        // --- 3. REDIRECCIÓN ---
        return redirect()->route('orders.index')->with('success', '¡Pago exitoso! Tu orden está siendo procesada.');
    }
}
