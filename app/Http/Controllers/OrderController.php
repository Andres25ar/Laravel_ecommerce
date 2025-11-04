<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order :: where ('buyer_id', Auth::id())    //consulta a la base de datos que user tiene asodiado esa order
                        ->with('products:id,name,price')    //para cargar la info de los productos
                        ->latest()
                        ->paginate(10);
        
        $orders->getCollection()->transform(function($order){
            $order->products_count = $order->product->count();
            return $order;
        });

        return Inertia::render('orders/index', ['orders' => $orders,]);
    }
}
