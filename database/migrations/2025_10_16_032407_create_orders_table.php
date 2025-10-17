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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            //clave foranea del comprador, donde al eliminar al comprador se elimina sus ordenes (?)
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);     //monto total
            $table->integer('discount')->nullable();    //descuento aplicado a la orden
            $table->string('payment_method');   //metodo de pago
            //estado de la compra (pendiente, pagado, enviado, entregado, cancelado), por defecto se crea como pendiente
            $table->enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
