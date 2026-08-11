<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $patients = Patient::with(['city', 'hospital'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($patients, 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'حدث خطأ أثناء جلب بيانات المرضى'], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'phone'         => 'required|digits:11',
            'blood_type'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'age'           => 'required|integer|min:0|max:120',
            'bags_quantity' => 'required|integer|min:1|max:20',
            'city_id'       => 'required|exists:cities,id',
            'hospital_id'   => 'required|exists:hospitals,id',
            'details'       => 'nullable|string',
        ], [
            'name.required'      => 'اسم المريض مطلوب',
            'phone.required'     => 'رقم الهاتف مطلوب',
            'phone.digits'       => 'رقم الهاتف يجب أن يكون 11 رقماً',
            'blood_type.in'      => 'فصيلة الدم غير صحيحة',
            'bags_quantity.min'  => 'يجب طلب كيس دم واحد على الأقل',
            'city_id.exists'     => 'المدينة المختارة غير موجودة',
            'hospital_id.exists' => 'المستشفى المختار غير موجود',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'يوجد خطأ في البيانات المدخلة',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $patient = Patient::create([
                'name'          => $request->name,
                'phone'         => $request->phone,
                'blood_type'    => $request->blood_type,
                'age'           => $request->age,
                'bags_quantity' => $request->bags_quantity,
                'status'        => 'pending',
                'city_id'       => $request->city_id,
                'hospital_id'   => $request->hospital_id,
                'details'       => $request->details,
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'تم تسجيل طلب المريض بنجاح',
                'data'    => $patient->load(['city', 'hospital'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'فشل الحفظ في قاعدة البيانات',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $patient = Patient::with(['city', 'hospital'])->find($id);

        if (!$patient) {
            return response()->json(['status' => 'error', 'message' => 'المريض غير موجود'], 404);
        }

        return response()->json($patient, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['status' => 'error', 'message' => 'المريض غير موجود'], 404);
        }

        try {
            $patient->update($request->only([
                'name', 'phone', 'blood_type', 'age', 'bags_quantity', 'status', 'city_id', 'hospital_id', 'details'
            ]));

            return response()->json([
                'status'  => 'success',
                'message' => 'تم تحديث بيانات المريض بنجاح',
                'data'    => $patient->load(['city', 'hospital'])
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'فشل التحديث: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['status' => 'error', 'message' => 'المريض غير موجود'], 404);
        }

        try {
            $patient->delete();
            return response()->json(['status' => 'success', 'message' => 'تم حذف بيانات المريض بنجاح'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'فشل الحذف'], 500);
        }
    }
}
