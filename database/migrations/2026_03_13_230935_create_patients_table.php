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
            $table->string('phone'); // هذا السطر سيحل مشكلة Column not found: phone
            $table->string('blood_type'); // لإضافة فصيلة الدم
            $table->integer('age'); // لإضافة السن
            $table->integer('bags_quantity')->default(1); // عدد الأكياس المطلوبة
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            
            // ربط المدينة والمستشفى (تأكد أن جداول cities و hospitals موجودة فعلاً)
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('set null');
            
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