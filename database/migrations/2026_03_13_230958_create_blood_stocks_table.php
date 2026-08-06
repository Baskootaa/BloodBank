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
        Schema::create('blood_stocks', function (Blueprint $table) {
            $table->id();
            
            // الربط مع جدول المستشفيات (مستشفى قد تكون اختيارية إذا كان مخزناً عاماً)
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('cascade');
            
            // نوع فصيلة الدم
            $table->string('blood_type'); 
            
            // كمية الأكياس (تم تعديل الاسم إلى quantity ليتوافق مع الـ Seeder)
            $table->integer('quantity')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_stocks');
    }
};
