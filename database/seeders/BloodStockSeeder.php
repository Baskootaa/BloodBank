<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BloodStock;
use App\Models\City;
use App\Models\Hospital;

class BloodStockSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إضافة المدن الأساسية (عشان تظهر في الـ Dashboard)
        $cities = [
            ['name' => 'سمنود'],
            ['name' => 'المحلة الكبرى'],
            ['name' => 'المنصورة'],
            ['name' => 'طنطا'],
        ];

        foreach ($cities as $cityData) {
            City::updateOrCreate(['name' => $cityData['name']], $cityData);
        }

        // 2. إضافة المستشفيات وربطها بالمدن
        $samannoudCity = City::where('name', 'سمنود')->first();
        $mahallaCity = City::where('name', 'المحلة الكبرى')->first();

        $hospitals = [
            [
                'name' => 'سمنود العام',
                'address' => 'وسط البلد - سمنود',
                'city_id' => $samannoudCity->id,
                'stock' => 100
            ],
            [
                'name' => 'المحلة العام',
                'address' => 'شارع البحر - المحلة',
                'city_id' => $mahallaCity->id,
                'stock' => 150
            ],
        ];

        foreach ($hospitals as $hosp) {
            Hospital::updateOrCreate(['name' => $hosp['name']], $hosp);
        }

        // 3. إضافة فصائل الدم (المخزون العام)
        $types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        foreach ($types as $type) {
            BloodStock::updateOrCreate(
                ['blood_type' => $type],
                ['quantity' => 50]
            );
        }
    }
}