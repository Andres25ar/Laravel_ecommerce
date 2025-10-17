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
        Schema::create('product_tag', function (Blueprint $table) {
            $table->primary(['product_id', 'tag_id']); //clave primaria compuesta
            //clave foranea de producto, donde al eliminar el producto se elimina la realcion con los tags, pero mo los tags
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            //clave foranea de tags, conde al eliminar los tags se elimina la relacion con el producto, pero no el producto
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_tag');
    }
};
