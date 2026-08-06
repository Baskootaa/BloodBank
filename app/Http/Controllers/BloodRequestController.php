<?php

namespace App\Http\Controllers;

use App\Models\BloodRequest;
use App\Models\Patient;
use App\Models\Hospital;
use App\Models\BloodStock; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BloodRequestController extends Controller
{
    /**
     * عرض جميع طلبات الاستغاثة مرتبة من الأحدث
     */
    public function index()
    {
        try {
            $requests = BloodRequest::with(['city', 'hospital'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($requests, 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'حدث خطأ أثناء جلب البيانات'], 500);
        }
    }

    /**
     * تسجيل استغاثة جديدة في جدول المرضى وجدول الطلبات
     */
    public function store(Request $request)
    {
        // 1. التحقق من صحة البيانات المدخلة
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'blood_type'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'phone'         => 'required|digits:11', 
            'age'           => 'required|integer|min:1|max:100',
            'city_id'       => 'required|exists:cities,id',
            'hospital_id'   => 'required|exists:hospitals,id',
            'bags_quantity' => 'required|integer|min:1|max:20',
            'details'       => 'nullable|string|max:500',
        ], [
            'name.required'     => 'اسم المريض مطلوب',
            'blood_type.in'      => 'فصيلة الدم غير صحيحة',
            'phone.digits'       => 'رقم الهاتف يجب أن يكون 11 رقم',
            'hospital_id.exists' => 'المستشفى المختار غير متاح',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'بيانات الاستغاثة غير مكتملة أو خاطئة',
                'errors'  => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            return DB::transaction(function () use ($validated) {
                
                // 2. تحديث أو إنشاء سجل المريض (الجدول الأول: patients)
                // أضفنا هنا كل الحقول اللي قاعدة البيانات عندك بتطلبها كـ NOT NULL
                $patient = Patient::updateOrCreate(
                    ['phone' => $validated['phone']],
                    [
                        'name'          => $validated['name'],
                        'blood_type'    => $validated['blood_type'],
                        'city_id'       => $validated['city_id'],
                        'age'           => $validated['age'],
                        'status'        => 'pending', 
                        'bags_quantity' => $validated['bags_quantity'],
                        'hospital_id'   => $validated['hospital_id'], 
                    ]
                );

                // 3. إنشاء طلب الاستغاثة (الجدول الثاني: blood_requests)
                $bloodRequest = BloodRequest::create([
                    'patient_id'    => $patient->id,
                    'name'          => $validated['name'],
                    'blood_type'    => $validated['blood_type'],
                    'phone'         => $validated['phone'],
                    'age'           => $validated['age'],
                    'city_id'       => $validated['city_id'],
                    'hospital_id'   => $validated['hospital_id'],
                    'bags_quantity' => $validated['bags_quantity'],
                    'details'       => $validated['details'] ?? null,
                    'status'        => 'pending',
                ]);

                return response()->json([
                    'status'  => 'success',
                    'message' => 'تم تسجيل البيانات في جدول المرضى والطلبات بنجاح',
                    'data'    => $bloodRequest->load(['city', 'hospital'])
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'حدث خطأ أثناء الحفظ في قاعدة البيانات',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حالة الطلب والمريض معاً
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,accepted,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'الحالة المطلوبة غير صالحة'], 422);
        }
        
        $bloodRequest = BloodRequest::findOrFail($id);
        
        if ($bloodRequest->status !== 'pending') {
            return response()->json(['status' => 'error', 'message' => 'هذا الطلب تمت معالجته مسبقاً.'], 400);
        }

        $newStatus = ($request->status === 'approved' || $request->status === 'accepted') ? 'accepted' : 'rejected';

        try {
            return DB::transaction(function () use ($bloodRequest, $newStatus) {
                
                if ($newStatus === 'accepted') {
                    $stock = BloodStock::where('hospital_id', $bloodRequest->hospital_id)
                        ->where('blood_type', $bloodRequest->blood_type)
                        ->lockForUpdate()
                        ->first();

                    if (!$stock || $stock->bags_quantity < $bloodRequest->bags_quantity) {
                        return response()->json([
                            'status' => 'error',
                            'message' => "المخزون غير كافٍ."
                        ], 400);
                    }
                    $stock->decrement('bags_quantity', (int) $bloodRequest->bags_quantity);
                }

                // تحديث جدول الطلبات
                $bloodRequest->status = $newStatus;
                $bloodRequest->save();

                // تحديث جدول المرضى
                if ($bloodRequest->patient_id) {
                    Patient::where('id', $bloodRequest->patient_id)->update(['status' => $newStatus]);
                }

                return response()->json(['status' => 'success', 'message' => 'تم التحديث في الجدولين بنجاح']);
            });
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'فشل التحديث: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $bloodRequest = BloodRequest::findOrFail($id);
            $bloodRequest->delete();
            return response()->json(['status' => 'success', 'message' => 'تم حذف الطلب بنجاح'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'فشل حذف الطلب'], 500);
        }
    }
}