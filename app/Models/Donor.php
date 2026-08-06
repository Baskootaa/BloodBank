<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Donor extends Model
{
    use HasFactory;

    /**
     * اسم الجدول المرتبط بالموديل
     */
    protected $table = 'donors'; 

    /**
     * الحقول المسموح بتخزينها (Mass Assignment)
     * تم إدراج bags_quantity لدعم نظام المخزون التفصيلي الجديد
     */
    protected $fillable = [
        'name', 
        'blood_type', 
        'phone', 
        'age', 
        'city_id',
        'hospital_id',   
        'bags_quantity', 
        'status'         
    ];

    /**
     * تحويل البيانات تلقائياً (Casting)
     * لضمان التعامل مع الأرقام كـ Integers في العمليات الحسابية (زي الـ increment)
     */
    protected $casts = [
        'age'           => 'integer',
        'city_id'       => 'integer',
        'hospital_id'   => 'integer',
        'bags_quantity' => 'integer',
    ];

    /**
     * تحميل العلاقات تلقائياً عند طلب بيانات المتبرع
     * مفيد جداً لعرض أسماء المدن والمستشفيات في الـ Dashboard فوراً
     */
    protected $with = ['city', 'hospital'];

    /**
     * علاقة المتبرع بالمدينة
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    /**
     * علاقة المتبرع بالمستشفى
     * تستخدم في DonorController لتحديد أي مستشفى سيزيد مخزونها
     */
    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class, 'hospital_id');
    }
}