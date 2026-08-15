<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed', // تم تعديل الحد الأدنى إلى 6 وإضافة التحقق من التوافق confirmed ليتوافق مع الفرونت إند
            'age' => 'nullable|integer',
            'phone' => 'nullable|string',
            'blood_type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'خطأ في بيانات الإدخال',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'age' => $request->age,
            'phone' => $request->phone,
            'blood_type' => $request->blood_type,
            'role' => 'user', // ✅ أي مستخدم جديد يبدأ كـ user تلقائياً
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'تم إنشاء الحساب بنجاح',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'age' => $user->age,
                'phone' => $user->phone,
                'blood_type' => $user->blood_type
            ]
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            'current_password' => 'required_with:new_password',
            'new_password' => 'nullable|string|min:8|confirmed',
        ], [
            'new_password.confirmed' => 'تأكيد كلمة المرور الجديدة غير متطابق',
            'current_password.required_with' => 'يجب إدخال كلمة المرور الحالية لتغيير كلمة المرور الجديدة',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('email')) $user->email = $request->email;

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'كلمة المرور الحالية غير صحيحة'], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        return response()->json([
            'message' => 'تم تحديث الملف الشخصي بنجاح',
            'user' => $user
        ], 200);
    }

    // ==========================================
    // 👑 دوال الأدمن الإضافية لإدارة المستخدمين
    // ==========================================

    // 1. جلب كل المستخدمين لعرضهم في القائمة المنسدلة للأدمن
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'غير مصرح لك بالوصول'], 403);
        }

        $users = User::select('id', 'name', 'email', 'phone', 'role', 'age', 'blood_type')->get();
        return response()->json($users, 200);
    }

    // 2. تحديث بيانات وصلاحية أي مستخدم بواسطة الأدمن
    public function updateUser(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'غير مصرح لك بالقيام بهذا الإجراء'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['message' => 'المستخدم غير موجود'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $id,
            'phone' => 'nullable|string',
            'role' => 'sometimes|in:user,employee,admin',
            'new_password' => 'nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->has('name')) $targetUser->name = $request->name;
        if ($request->has('email')) $targetUser->email = $request->email;
        if ($request->has('phone')) $targetUser->phone = $request->phone;
        if ($request->has('role')) $targetUser->role = $request->role;
        
        if ($request->filled('new_password')) {
            $targetUser->password = Hash::make($request->new_password);
        }

        $targetUser->save();

        return response()->json([
            'message' => 'تم تحديث بيانات المستخدم وصلاحيته بنجاح',
            'user' => $targetUser
        ], 200);
    }

    // 3. حذف مستخدم بواسطة الأدمن
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'غير مصرح لك بالقيام بهذا الإجراء'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['message' => 'المستخدم غير موجود'], 404);
        }

        // منع الأدمن من حذف حسابه الشخصي بالخطأ
        if ($request->user()->id === $targetUser->id) {
            return response()->json(['message' => 'لا يمكنك حذف حسابك الشخصي الحالي'], 403);
        }

        $targetUser->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح'
        ], 200);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}
