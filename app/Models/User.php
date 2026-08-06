<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * الحقول القابلة للتعبئة (Mass Assignment)
     * تم إضافة الحقول الجديدة هنا لتتمكن من تخزينها عند التسجيل
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',        // أضفنا الرتبة (admin/user)
        'age',         // أضفنا العمر
        'phone',       // أضفنا رقم التليفون
        'blood_type',  // أضفنا فصيلة الدم
    ];

    /**
     * الحقول المخفية التي لا تظهر عند تحويل الموديل إلى JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * التحويل التلقائي للأنواع (Casting)
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // لضمان تشفير الباسورد تلقائياً في الإصدارات الحديثة
    ];
}