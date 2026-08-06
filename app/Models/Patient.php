<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;

    /**
     * الحقول المسموح بتخزينها
     * أضفنا الحقول الناقصة لتطابق جدول الـ blood_requests
     */
    protected $fillable = [
        'name', 
        'blood_type', 
        'phone', 
        'city_id', 
        'age',
        'bags_quantity', // تم إضافة هذا السطر
        'hospital_id',   // تم إضافة هذا السطر
        'status'         // تم إضافة هذا السطر (لأن الجدول يحتوي على حالة الطلب)
    ];

    /**
     * علاقة المريض بالمدينة
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    /**
     * علاقة المريض بالمستشفى
     * بما أن المريض يتواجد في مستشفى معين
     */
    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }
}