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
        Schema::create('donors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('blood_type');
            $table->string('phone');
            $table->integer('age');
            
            // إضافة حقل الكمية (Quantity) الافتراضي 1
            $table->integer('quantity')->default(1);
            
            // إضافة الحالة (Status) كـ enum لضمان قبول قيم محددة فقط
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            
            // ربط المتبرع بالمدينة (City)
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('cascade');
            
            // ربط المتبرع بالمستشفى (Hospital)
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};
