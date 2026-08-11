<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_requests', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name'); // اسم المريض أو الحالة
            $table->string('blood_type');
            $table->string('phone');
            $table->integer('age');
            $table->integer('bags_quantity')->default(1);
            
            // توحيد الـ Status لتجنب أخطاء الـ API
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('cascade');
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_requests');
    }
};
