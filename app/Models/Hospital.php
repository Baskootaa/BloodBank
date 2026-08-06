<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'address', 
        'city_id'
    ];

    /**
     * العلاقة مع جدول المدن
     */
    public function city()
    {
        // نحدد city_id لضمان الربط الصحيح
        return $this->belongsTo(City::class, 'city_id');
    }

    /**
     * العلاقة مع جدول مخزون الدم (blood_stocks)
     * ملاحظة: تأكد أن اسم الموديل BloodStock (بالفرد)
     */
    public function bloodStocks()
    {
        /**
         * هنا بنقول لـ Laravel يروح يدور في جدول blood_stocks 
         * باستخدام عمود hospital_id لربطه بالمستشفى
         */
        return $this->hasMany(BloodStock::class, 'hospital_id');
    }

    /**
     * العلاقة مع المتبرعين (donors)
     */
    public function donors()
    {
        return $this->hasMany(Donor::class, 'hospital_id');
    }

    /**
     * العلاقة مع الاستغاثات
     * تأكد أن اسم الموديل عندك هو EmergencyRequest أو BloodRequest
     */
   /**
 * العلاقة مع طلبات الدم (Blood Requests)
 */
       public function bloodRequests()
         {
            // تغيير اسم الموديل ليكون مطابقاً للملف الموجود عندك في الصورة
            return $this->hasMany(BloodRequest::class, 'hospital_id');
         }
 }