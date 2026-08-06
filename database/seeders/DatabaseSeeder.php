<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // تنفيذ الـ Seeders بالترتيب
        $this->call([
            AdminSeeder::class,      // أولاً: إضافة حساب الدكتور (dr.mohamed)
            BloodStockSeeder::class, // ثانياً: إضافة بيانات المخزون والمستشفيات
        ]);

        // (اختياري) إضافة يوزر تجريبي إضافي
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}