<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // Relación uno a muchos (inversa): Un usuario pertenece a un Rol.
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function isAdmin(): bool
    {
        return $this->role->name === 'administrador';
    }

    public function isSeller(): bool
    {
        return $this->role->name === 'vendedor';
    }

    // Relación uno a muchos: Un vendedor (usuario) tiene muchos productos.
    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    // Relación uno a muchos: Un comprador (usuario) tiene muchas órdenes.
    public function orders()
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    // Relación uno a muchos: Un usuario tiene muchos items en su carrito.
    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }
}

