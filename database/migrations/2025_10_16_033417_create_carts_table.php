<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            //clave foranea del usuario comprador, que al eliminarse de la base de datos se elimina su carrito
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            //clave foranea de los productos, que al eliminar los productos, estos se eliminan del carrito 
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity');
            $table->timestamps();

            // Un usuario solo puede tener un producto una vez en el carrito, se actualiza la cantidad
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
