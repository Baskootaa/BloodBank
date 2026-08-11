<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class BloodStock extends Model
{
    use HasFactory;

    // اسم الجدول في قاعدة البيانات
    protected $table = 'blood_stocks';

    // الحقول المسموح بتعبئتها
    protected $fillable = [
        'hospital_id',
        'blood_type',
        'bags_quantity' 
    ];

    /**
     * تحويل البيانات لضمان الدقة (Casting)
     */
    protected $casts = [
        'bags_quantity' => 'integer',
        'hospital_id'   => 'integer',
    ];

    /**
     * علاقة المخزون بالمستشفى
     * نحدد hospital_id كـ Foreign Key لضمان الربط
     */
    public function hospital()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id');
    }

    /**
     * دالة مساعدة (Mutator) للتأكد أن المخزون لا يقل عن صفر
     * تم استخدام الطريقة الحديثة في Laravel لضمان الاستقرار
     */
    protected function bagsQuantity(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value < 0 ? 0 : $value,
        );
    }

    /**
     * Scope للبحث السريع عن فصيلة معينة
     * مثال: BloodStock::ofType('A+')->get();
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('blood_type', $type);
    }
}
