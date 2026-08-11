<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * جلب كافة المدن.
     */
    public function index()
    {
        $cities = City::withCount('hospitals')->orderBy('name', 'asc')->get();
        return response()->json($cities, 200);
    }

    /**
     * إضافة مدينة جديدة (الخاصة بزرار إضافة مدينة).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:cities,name',
        ]);

        $city = City::create([
            'name' => $request->name
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'تم إضافة المدينة بنجاح',
            'data' => $city
        ], 201);
    }
}
