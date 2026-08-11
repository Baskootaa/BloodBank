<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodRequest extends Model
{
    use HasFactory;

    /**
     * الحقول المسموح بتخزينها (Mass Assignment)
     */
    protected $fillable = [
        'patient_id',   // تم التعديل ليطابق اسم العمود الفعلي في قاعدة البيانات
        'blood_type',
        'age',
        'phone',
        'city_id',
        'hospital_id',
        'bags_quantity',
        'details',      // تخزين ملاحظات إضافية
        'status',
    ];

    /**
     * علاقة الطلب بالمدينة
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    /**
     * علاقة الطلب بالمستشفى
     */
    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class, 'hospital_id');
    }

    /**
     * تحميل العلاقات أوتوماتيكياً
     */
    protected $with = ['city', 'hospital'];
}
