<?php

namespace App\Http\Controllers;

use App\Models\BloodStock;
use App\Models\BloodRequest;
use App\Models\Hospital;
use App\Models\Donor;
use Illuminate\Http\Request;

class BloodStockController extends Controller
{
    public function index()
    {
        return response()->json(BloodStock::all()->map(function($item) {
            $q = $item->bags_quantity ?? 0;
            
            // تحديد الحالة بناءً على المخزون (الألوان والدرجات)
            if ($q < 10) { $status = 'Critical'; $color = '#FF0000'; }
            elseif ($q < 30) { $status = 'Warning'; $color = '#FFA500'; }
            elseif ($q <= 70) { $status = 'Good'; $color = '#fafc60'; }
            elseif ($q <= 100) { $status = 'Safe'; $color = '#008000'; }
            else { $status = 'Abundant'; $color = '#0000FF'; }

            return [
                'id' => $item->id,
                'name' => $item->hospital->name ?? 'غير محدد',
                'blood_type' => $item->blood_type,
                'address' => $item->hospital->address ?? 'غير محدد', 
                'phone' => $item->hospital->phone ?? 'غير محدد',         
                'stock' => $q,                   
                'status' => $status,
                'color' => $color
            ];
        }));
    }

    /**
     * الإحصائيات العامة للوحة القيادة
     */
    public function getStats()
    {
        try {
            return response()->json([
                'status' => 'success',
                'pending_requests' => BloodRequest::where('status', 'pending')->count(),
                'total_bags' => BloodStock::sum('bags_quantity'),
                'alerts' => BloodStock::with('hospital')
                    ->where('bags_quantity', '<', 5)
                    ->get()
                    ->map(fn($s) => "نقص في فصيلة {$s->blood_type} بمستشفى " . ($s->hospital->name ?? 'غير معروفة')),
                'hospitals_count' => Hospital::count(),
                'donors_count' => Donor::count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * الدالة المنقذة: تحديث المخزون (زيادة أو نقصان)
     * تدعم استقبال ID المستشفى من الرابط أو من البيانات المرسلة
     */
    public function updateStock(Request $request, $id = null)
    {
        // 1. تحديد ID المستشفى (سواء من الرابط URL أو من جسم الطلب Body)
        $hospitalId = $id ?: $request->hospital_id;

        // 2. محاولة إيجاد الكمية حتى لو مبعوتة بأسماء مختلفة من الـ React
        // هيدور على bags_quantity أو stock أو quantity
        $amountRaw = $request->bags_quantity ?? $request->stock ?? $request->quantity;

        // دمج البيانات في الـ request عشان الـ Validation ميرفضش الطلب
        $request->merge([
            'hospital_id' => $hospitalId,
            'bags_quantity' => $amountRaw
        ]);

        $validated = $request->validate([
            'hospital_id'   => 'required|exists:hospitals,id',
            'blood_type'    => 'required|string',
            'bags_quantity' => 'required|integer', 
        ]);

        try {
            $stock = BloodStock::where('hospital_id', $validated['hospital_id'])
                               ->where('blood_type', $validated['blood_type'])
                               ->first();

            $amount = (int) $validated['bags_quantity'];

            if ($stock) {
                // 3. حماية: منع النزول تحت الصفر
                if ($amount < 0 && ($stock->bags_quantity + $amount) < 0) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "المخزون الحالي ({$stock->bags_quantity}) لا يكفي لخصم " . abs($amount) . " أكياس."
                    ], 400);
                }

                // 4. تنفيذ الجمع الجبري الصحيح (مثال: 20 + -2 = 18)
                $newQuantity = $stock->bags_quantity + $amount;
                $stock->update(['bags_quantity' => $newQuantity]);
                
                $message = $amount > 0 ? "تمت إضافة الكمية بنجاح" : "تم خصم الكمية بنجاح";
            } else {
                // لو السجل مش موجود والكمية سالبة، نرفض
                if ($amount < 0) {
                    return response()->json(['status' => 'error', 'message' => "لا يمكن الخصم من مخزون غير موجود"], 400);
                }

                $stock = BloodStock::create([
                    'hospital_id'   => $validated['hospital_id'],
                    'blood_type'    => $validated['blood_type'],
                    'bags_quantity' => $amount,
                ]);
                $message = "تم إنشاء سجل فصيلة جديد وإضافة الكمية";
            }

            return response()->json([
                'status' => 'success',
                'message' => $message,
                'current_stock' => $stock->fresh()->bags_quantity
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        if ($stock = BloodStock::find($id)) {
            $stock->delete();
            return response()->json(['message' => 'Deleted!'], 200);
        }
        return response()->json(['message' => 'Not Found'], 404);
    }
}