<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonorController;
use App\Http\Controllers\BloodRequestController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\BloodStockController;
use App\Models\User;
use App\Models\City;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| API Routes - مشروع BASKOTA (بسكوتة)
|--------------------------------------------------------------------------
*/

// --- 1. حسابات المستخدمين (Public Auth) ---
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// --- 2. إدارة المتبرعين (Donors) ---
Route::prefix('donors')->group(function () {
    Route::get('/', [DonorController::class, 'index']);
    Route::post('/', [DonorController::class, 'store']);
    Route::get('{id}', [DonorController::class, 'show']);
    Route::post('{id}/update-status', [DonorController::class, 'updateStatus']); 
    Route::delete('{id}', [DonorController::class, 'destroy']);
});

// --- 3. البيانات الأساسية (Cities & Hospitals) ---
Route::get('cities', function () {
    return response()->json(City::orderBy('name', 'asc')->get());
});
Route::get('hospitals', [HospitalController::class, 'index']); 
Route::post('hospitals/{id}/update-stock', [BloodStockController::class, 'updateStock']);

// --- 4. طلبات الاستغاثة (Blood Requests) ---
Route::prefix('emergency-requests')->group(function () {
    Route::get('/', [BloodRequestController::class, 'index']);
    Route::post('/', [BloodRequestController::class, 'store']); 
    Route::post('{id}/update-status', [BloodRequestController::class, 'updateStatus']); 
    Route::delete('{id}', [BloodRequestController::class, 'destroy']);
});

// Alias إضافي لضمان عدم تعطل أي أجزاء قديمة
Route::prefix('blood-requests')->group(function () {
    Route::get('/', [BloodRequestController::class, 'index']); 
    Route::post('/', [BloodRequestController::class, 'store']);
    Route::post('{id}/update-status', [BloodRequestController::class, 'updateStatus']);
    Route::delete('{id}', [BloodRequestController::class, 'destroy']);
});

// --- 5. مخزون الفصائل والإحصائيات (Blood Stocks & Stats) ---
Route::get('dashboard-stats', [BloodStockController::class, 'getStats']);
Route::get('blood-stocks', [BloodStockController::class, 'index']);
Route::post('update-stock', [BloodStockController::class, 'updateStock']);

// --- 6. إصلاح حساب الأدمن (للتأكد من الصلاحيات) ---
Route::get('/fix-admin', function () {
    $user = User::updateOrCreate(
        ['email' => 'Baskota@gmail.com'], 
        [
            'name' => 'Baskota',
            'password' => Hash::make('12345678'),
            'is_admin' => 1
        ]
    );
    return response()->json(['message' => 'Admin account verified as Baskota!', 'user' => $user]);
});

// --- 7. المسارات المحمية (Sanctum) - تعديل الملف الشخصي ---
Route::middleware('auth:sanctum')->group(function () {
    
    // جلب بيانات المستخدم الحالي
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/admin/me', [AuthController::class, 'profile']); 

    // تحديث كلمة المرور
    Route::post('/admin/update-password', function (Request $request) {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ], [
            'current_password.required' => 'كلمة المرور الحالية مطلوبة',
            'new_password.min' => 'كلمة المرور الجديدة يجب أن لا تقل عن 8 أحرف',
            'new_password.confirmed' => 'تأكيد كلمة المرور غير متطابق',
        ]);

        $user = $request->user();
        
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'كلمة المرور الحالية غير صحيحة'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'تم تحديث كلمة المرور بنجاح']);
    });

    // تسجيل الخروج
    Route::post('logout', [AuthController::class, 'logout']);
});
