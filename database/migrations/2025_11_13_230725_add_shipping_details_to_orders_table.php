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
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
                ->default('pending')->change();
            
            //datos de envio
            $table->string('shipping_address_line_1')->nullable()->after('status');
            $table->string('shipping_city')->nullable()->after('shipping_address_line_1');
            $table->string('shipping_state')->nullable()->after('shipping_city');
            $table->string('shipping_postal_code')->nullable()->after('shipping_state');

            //informacion de despacho
            $table->enum('shipping_type', ['local', 'sucursal', 'domicilio'])->nullable()->after('shipping_postal_code');
            $table->string('shipping_tracking_code')->nullable()->after('shipping_type');
            $table->date('estimated_delivery_date')->nullable()->after('shipping_tracking_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
                ->default('pending')->change();

            $table->dropColumn([
                'shipping_address_line_1',
                'shipping_city',
                'shipping_state',
                'shipping_postal_code',
                'shipping_type',
                'shipping_tracking_code',
                'estimated_delivery_date'
            ]);
        });
    }
};
