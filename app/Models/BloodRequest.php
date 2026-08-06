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
     * ملاحظة: تم تغيير 'patient_name' إلى 'name' ليطابق قاعدة البيانات
     * وتم إضافة 'patient_id' و 'details' لضمان حفظ كل البيانات
     */
    protected $fillable = [
        'patient_id',   // مهم لربط الطلب بالمريض
        'name',         // تم التعديل ليطابق العمود في قاعدة البيانات
        'blood_type',
        'age',
        'phone',
        'city_id',
        'hospital_id',
        'bags_quantity',
        'details',      // أضفه إذا كنت تريد تخزين ملاحظات إضافية
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
 * علاقة الطلب بالمريض
 */
public function patient(): BelongsTo
{
    return $this->belongsTo(Patient::class, 'patient_id');
}
    /**
     * تحميل العلاقات أوتوماتيكياً لضمان ظهور الأسماء في React
     */
    protected $with = ['city', 'hospital'];
}