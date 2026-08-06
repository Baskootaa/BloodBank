<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    /**
     * جلب قائمة المستشفيات مع المخزون بناءً على مسميات phpMyAdmin الحقيقية.
     */
    public function index(Request $request)
    {
        // نستخدم eager loading لجلب علاقة bloodStocks والمدينة
        $query = Hospital::with(['city', 'bloodStocks']);

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        // أضفنا values() في النهاية لضمان رجوع البيانات كمصفوفة Array [] وليس Object {}
        // عشان الـ React يقدر يعمل عليها .filter() و .map() بدون مشاكل
        $hospitals = $query->orderBy('name', 'asc')->get()->map(function ($hospital) {
            /**
             * ملاحظة لمازن: 
             * في قاعدة البيانات عندك العمود اسمه bags_quantity
             * لذلك سنقوم بجمع هذا العمود تحديداً.
             */
            $hospital->total_bags_count = $hospital->bloodStocks->sum('bags_quantity');

            return $hospital;
        })->values(); 

        return response()->json($hospitals, 200);
    }

    /**
     * جلب بيانات مستشفى معين بالتفصيل.
     */
    public function show($id)
    {
        $hospital = Hospital::with(['city', 'bloodStocks'])->find($id);

        if (!$hospital) {
            return response()->json([
                'status' => 'error',
                'message' => 'المستشفى غير موجودة'
            ], 404);
        }

        // حساب الإجمالي باستخدام العمود الصحيح bags_quantity
        $hospital->total_bags_count = $hospital->bloodStocks->sum('bags_quantity');

        return response()->json($hospital, 200);
    }

    /**
     * تحديث مخزون الدم لمستشفى.
     * هنا بنستخدم bags_quantity عشان يسمع في الجدول صح
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'blood_type' => 'required|string', 
            'quantity' => 'required|integer' 
        ]);

        $hospital = Hospital::findOrFail($id);

        /**
         * تحديث أو إنشاء سجل:
         * الـ key هو blood_type
         * القيمة اللي بتتحدث هي bags_quantity (مطابق لجدولك في phpMyAdmin)
         */
        $stock = $hospital->bloodStocks()->updateOrCreate(
            ['blood_type' => $request->blood_type],
            ['bags_quantity' => $request->quantity] 
        );

        return response()->json([
            'status' => 'success',
            'message' => 'تم تحديث المخزون بنجاح',
            'data' => $stock
        ]);
    }
}