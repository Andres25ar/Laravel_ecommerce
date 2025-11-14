<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    // Relación uno a muchos (inversa): El item del carrito pertenece a un usuario.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación uno a muchos (inversa): El item del carrito corresponde a un producto.
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}

