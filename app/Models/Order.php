<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'total_amount',
        'discount',
        'payment_method',
        'status',
    ];

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

