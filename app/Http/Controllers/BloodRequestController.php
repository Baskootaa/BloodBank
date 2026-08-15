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
     * عرض جميع طلبات الاستغاثة مرتبة من الأحدث مع جلب بيانات المريض
     */
    public function index()
    {
        try {
            // تم إضافة 'patient' هنا لضمان جلب بيانات جدول patients المرتبط بالطلب
            $requests = BloodRequest::with(['city', 'hospital', 'patient'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($requests, 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'حدث خطأ أثناء جلب البيانات: ' . $e->getMessage()], 500);
        }
    }

    /**
     * جلب الإشعارات الخاصة بطلبات الدم (للـ Navbar)
     */
    public function getNotifications()
    {
        try {
            // جلب طلبات الدم المعلقة أو الجديدة كمثال للإشعارات
            $requests = BloodRequest::with(['hospital', 'city'])->where('status', 'pending')->latest()->take(5)->get();
            
            $notifications = $requests->map(function($req) {
                // فصيلة الدم والمستشفى كعنوان وفرعي للإشعار
                return [
                    'title' => 'طلب دم عاجل: ' . $req->blood_type,
                    'sub' => ($req->hospital->name ?? $req->hospital_name ?? 'مستشفى غير محدد') . ' - ' . ($req->city->name ?? $req->city ?? '')
                ];
            });

            return response()->json($notifications, 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'حدث خطأ أثناء جلب الإشعارات'], 500);
        }
    }

    /**
     * تسجيل استغاثة جديدة في جدول المرضى وجدول الطلبات
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'required|string|max:255',
            'blood_type'    => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'phone'         => 'required|string', // تم تعديله من digits:11 إلى string ليكون مرناً مع مختلف صيغ الهواتف التي يرسلها الفرونت إند
            'age'           => 'required|integer|min:1|max:100',
            'city_id'       => 'required|exists:cities,id',
            'hospital_id'   => 'required|exists:hospitals,id',
            'bags_quantity' => 'required|integer|min:1|max:20',
            'details'       => 'nullable|string|max:500',
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

                // إنشاء سجل جديد تماماً للمريض مع كل طلب استغاثة لضمان تطابق الاسم ورقم الهاتف
                $patient = Patient::create([
                    'name'          => $validated['name'],
                    'phone'         => $validated['phone'],
                    'blood_type'    => $validated['blood_type'],
                    'city_id'       => $validated['city_id'],
                    'age'           => $validated['age'],
                    'status'        => 'pending', 
                    'bags_quantity' => $validated['bags_quantity'],
                    'hospital_id'   => $validated['hospital_id'], 
                ]);

                // إنشاء طلب الاستغاثة وربطه بـ patient_id الجديد
                $bloodRequest = BloodRequest::create([
                    'patient_id'    => $patient->id,
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
                    'message' => 'تم تسجيل الاستغاثة بنجاح',
                    'data'    => $bloodRequest->load(['city', 'hospital', 'patient'])
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'حدث خطأ أثناء الحفظ',
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
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'الحالة المطلوبة غير صالحة', 'errors' => $validator->errors()], 422);
        }

        $bloodRequest = BloodRequest::findOrFail($id);
        $inputStatus = strtolower(trim($request->status));
        $newStatus = (in_array($inputStatus, ['approved', 'accepted', 'active'])) ? 'accepted' : 'rejected';

        try {
            return DB::transaction(function () use ($bloodRequest, $newStatus) {

                if ($newStatus === 'accepted' && $bloodRequest->status !== 'accepted') {
                    $stock = BloodStock::where('hospital_id', $bloodRequest->hospital_id)
                        ->where('blood_type', $bloodRequest->blood_type)
                        ->lockForUpdate()
                        ->first();

                    if (!$stock || $stock->bags_quantity < $bloodRequest->bags_quantity) {
                        return response()->json([
                            'status' => 'error',
                            'message' => "عذراً، مخزون الدم غير كافٍ في المستشفى."
                        ], 400);
                    }
                    $stock->decrement('bags_quantity', (int) $bloodRequest->bags_quantity);
                }

                // تحديث الطلب
                $bloodRequest->status = $newStatus;
                $bloodRequest->save();

                // تحديث المريض المرتبط برقم الهاتف أو الـ ID
                if ($bloodRequest->patient_id) {
                    Patient::where('id', $bloodRequest->patient_id)->update(['status' => $newStatus]);
                } else {
                    Patient::where('phone', $bloodRequest->phone)->update(['status' => $newStatus]);
                }

                return response()->json([
                    'status' => 'success', 
                    'message' => 'تم تحديث حالة الاستغاثة بنجاح',
                    'data' => $bloodRequest->load(['city', 'hospital', 'patient'])
                ], 200);
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
