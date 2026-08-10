<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use App\Models\City;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    /**
     * جلب قائمة المستشفيات مع المخزون والمدينة.
     */
    public function index(Request $request)
    {
        $query = Hospital::with(['city', 'bloodStocks']);

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $hospitals = $query->orderBy('name', 'asc')->get()->map(function ($hospital) {
            $hospital->total_bags_count = $hospital->bloodStocks->sum('bags_quantity');
            return $hospital;
        })->values(); 

        return response()->json($hospitals, 200);
    }

    /**
     * إضافة مستشفى جديد يدوياً.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'city_id' => 'required|exists:cities,id',
            'stock' => 'nullable|integer'
        ]);

        $hospital = Hospital::create([
            'name' => $request->name,
            'address' => $request->address ?? 'غير محدد',
            'city_id' => $request->city_id,
            'stock' => $request->stock ?? 0,
        ]);

        // جلب المستشفى مع بيانات المدينة لترجيعها للفرونت إند بشكل متكامل
        $hospital->load('city');

        return response()->json([
            'status' => 'success',
            'message' => 'تم إضافة المستشفى بنجاح',
            'data' => $hospital
        ], 201);
    }

    /**
     * جلب قائمة المدن لاستخدامها في الـ Select في الواجهة.
     */
    public function getCities()
    {
        $cities = City::orderBy('name', 'asc')->get();
        return response()->json($cities, 200);
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

        $hospital->total_bags_count = $hospital->bloodStocks->sum('bags_quantity');

        return response()->json($hospital, 200);
    }

    /**
     * تحديث مخزون الدم لمستشفى.
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'blood_type' => 'required|string', 
            'quantity' => 'required|integer' 
        ]);

        $hospital = Hospital::findOrFail($id);

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
