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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone'); 
            $table->string('blood_type'); 
            $table->integer('age'); 
            $table->integer('bags_quantity')->default(1); 
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            
            // ربط المدينة والمستشفى 
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('set null');
            
            // عمود التفاصيل الإضافية الملاحظ في قاعدة البيانات
            $table->text('details')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
