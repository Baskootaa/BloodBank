<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    \App\Models\User::create([
        'name' => 'Baskota',
        'email' => 'baskota@gmail.com', // حط إيميل الدكتور هنا
        'password' => bcrypt('12345678'),
        'is_admin' => 1
    ]);
}
}
