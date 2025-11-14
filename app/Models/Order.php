<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id', //id del comprador
        'total_amount',
        'discount',
        'payment_method',
        'status',
        //datos envio
        'shipping_address_line_1',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        //datos de despacho
        'shipping_type',
        'shipping_tracking_code',
        'estimated_delivery_date',
    ];

    protected function casts(): array
    {
        return [
            'estimated_delivery_date' => 'date',
        ];
    }

    // Relación uno a muchos (inversa): Una orden pertenece a un comprador (Usuario).
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // Relación muchos a muchos: Una orden tiene muchos productos.
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')
                    ->withPivot('quantity', 'price') // Incluir campos de la tabla pivote
                    ->withTimestamps();
    }
}

