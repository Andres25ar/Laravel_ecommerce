<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Muestra la lista de órdenes que contienen productos del vendedor.
     */
    public function index()
    {
        $sellerId = Auth::id();

        $orders = Order::whereHas('products', function ($query) use ($sellerId) {
            // 1. Solo trae órdenes que TENGAN productos de este vendedor
            $query->where('seller_id', $sellerId);
        })
            ->with([
                'buyer:id,name', // Trae el nombre del comprador
                'products' => function ($query) use ($sellerId) {
                    // 2. Carga ÚNICAMENTE los productos de esta orden que sean del vendedor
                    $query->where('seller_id', $sellerId);
                }
            ])
            ->where('status', '!=', 'pending') // No mostrar órdenes 'pending' (aún no pagadas)
            ->latest('id')
            ->paginate(10);

        return Inertia::render('seller/orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Actualiza la información de envío de una orden.
     */
    public function update(Request $request, Order $order)
    {
        $sellerId = Auth::id();

        // 3. Autorización: Asegurarse que este vendedor tenga productos en esta orden
        $hasProductInOrder = $order->products()->where('seller_id', $sellerId)->exists();

        if (!$hasProductInOrder) {
            abort(403, 'Acción no autorizada.');
        }

        // 4. Validación de los datos del formulario de envío
        $validated = $request->validate([
            //'status' => ['required', Rule::in(['processing', 'shipped'])], // El vendedor solo puede poner estos estados
            'shipping_type' => ['required', Rule::in(['local', 'sucursal', 'domicilio'])],
            'shipping_tracking_code' => 'nullable|string|max:255',
            'estimated_delivery_date' => 'nullable|date',
        ]);

        // Asignamos un estado general. Si el vendedor actualiza, pasa a "processing".
        $validated['status'] = 'processing';

        // Si el vendedor añade un código de seguimiento, pasa a "shipped".
        if ($request->filled('shipping_tracking_code')) {
            $validated['status'] = 'shipped';
        }

        // 5. Actualizar la orden
        $order->update($validated);

        return redirect()->back()->with('success', 'Orden actualizada.');
    }
}
