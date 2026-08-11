<?php

namespace App\Http\Controllers;

use App\Models\Donor;
use App\Models\Hospital;
use App\Models\BloodStock; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DonorController extends Controller
{
    // عرض كل المتبرعين مع جلب المدينة والمستشفى
    public function index()
    {
        try {
            $donors = Donor::with(['city', 'hospital'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($donors, 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'حدث خطأ أثناء جلب البيانات'], 500);
        }
    }

    // إضافة متبرع جديد مع Validation قوي
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'blood_type'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-', // تحديد فصائل الدم المسموحة فقط
            'phone'         => 'required|digits:11', // التأكد من أن الهاتف 11 رقم بالضبط
            'age'           => 'required|integer|min:18|max:65',
            'city_id'       => 'required|exists:cities,id', 
            'hospital_id'   => 'required|exists:hospitals,id', 
            'bags_quantity' => 'required|integer|min:1|max:10', 
        ], [
            // رسائل خطأ مخصصة بالعربي لتحسين تجربة المستخدم
            'name.required'     => 'يرجى إدخال اسم المتبرع',
            'blood_type.in'     => 'فصيلة الدم المختارة غير صحيحة',
            'phone.required'    => 'رقم الهاتف مطلوب',
            'phone.digits'      => 'رقم الهاتف يجب أن يتكون من 11 رقم (مثل 01234567890)',
            'age.min'           => 'يجب أن يكون عمر المتبرع 18 عاماً على الأقل',
            'age.max'           => 'الحد الأقصى للعمر هو 65 عاماً',
            'city_id.exists'    => 'المدينة المختارة غير موجودة في نظامنا',
            'hospital_id.exists'=> 'المستشفى المختار غير متاح حالياً',
            'bags_quantity.min' => 'يجب التبرع بـ كيس دم واحد على الأقل',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'يوجد خطأ في البيانات المدخلة، يرجى المراجعة',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $donor = Donor::create([
                'name'          => $request->name,
                'blood_type'    => $request->blood_type,
                'phone'         => $request->phone,
                'age'           => $request->age,
                'city_id'       => $request->city_id,
                'hospital_id'   => $request->hospital_id,
                'bags_quantity' => $request->bags_quantity,
                'status'        => 'pending', 
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'تم تسجيل بيانات التبرع بنجاح، في انتظار تأكيد المستشفى',
                'data'    => $donor->load(['city', 'hospital']) 
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'فشل الحفظ في قاعدة البيانات، تأكد من اتصال السيرفر',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حالة المتبرع وتعديل المخزون
     */
    public function updateStatus(Request $request, $id)
    {
        $donor = Donor::find($id);

        if (!$donor) {
            return response()->json(['status' => 'error', 'message' => 'المتبرع غير موجود'], 404);
        }

        $newStatus = strtolower($request->status); 
        $oldStatus = strtolower($donor->status);

        try {
            return DB::transaction(function () use ($donor, $newStatus, $oldStatus) {
                
                $acceptedStatuses = ['accepted', 'approved'];

                // 1. حالة القبول: زيادة المخزون
                if (in_array($newStatus, $acceptedStatuses) && !in_array($oldStatus, $acceptedStatuses)) {
                    
                    $stock = BloodStock::firstOrCreate(
                        ['hospital_id' => $donor->hospital_id, 'blood_type' => $donor->blood_type],
                        ['bags_quantity' => 0]
                    );

                    $stock->increment('bags_quantity', $donor->bags_quantity);
                }
                
                // 2. حالة الرفض (إذا كان مقبولاً سابقاً): خصم من المخزون
                if ($newStatus === 'rejected' && in_array($oldStatus, $acceptedStatuses)) {
                    
                    $stock = BloodStock::where('hospital_id', $donor->hospital_id)
                                       ->where('blood_type', $donor->blood_type)
                                       ->first();

                    if ($stock) {
                        $stock->decrement('bags_quantity', $donor->bags_quantity);
                        if ($stock->bags_quantity < 0) $stock->update(['bags_quantity' => 0]);
                    }
                }

                $donor->status = $newStatus;
                $donor->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'تم تحديث الحالة وتحديث المخزون بنجاح',
                    'data' => $donor->load(['city', 'hospital'])
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'خطأ في التحديث: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $donor = Donor::find($id);
            if ($donor) {
                $acceptedStatuses = ['accepted', 'approved'];

                if (in_array(strtolower($donor->status), $acceptedStatuses)) {
                    $stock = BloodStock::where('hospital_id', $donor->hospital_id)
                                       ->where('blood_type', $donor->blood_type)
                                       ->first();
                    if ($stock) {
                        $stock->decrement('bags_quantity', $donor->bags_quantity);
                        if ($stock->bags_quantity < 0) $stock->update(['bags_quantity' => 0]);
                    }
                }
                
                $donor->delete();
                return response()->json(['status' => 'success', 'message' => 'تم الحذف بنجاح']);
            }
            return response()->json(['status' => 'error', 'message' => 'المتبرع غير موجود'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'فشل الحذف'], 500);
        }
    }
}
