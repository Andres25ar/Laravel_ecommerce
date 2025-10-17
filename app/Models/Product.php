<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'inclusions',
        'price',
        'stock',
        'seller_id',
        'category_id',
    ];

    // Relación uno a muchos (inversa): Un producto pertenece a un Vendedor (Usuario).
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    // Relación uno a muchos (inversa): Un producto pertenece a una Categoría.
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relación uno a muchos: Un producto tiene muchas Imágenes.
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    // Relación muchos a muchos: Un producto puede tener muchas Etiquetas (Tags).
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'product_tag');
    }
}

