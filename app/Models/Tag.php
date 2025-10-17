<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    // Relación muchos a muchos: Una etiqueta puede estar en muchos productos.
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_tag');
    }
}

