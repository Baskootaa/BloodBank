<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class City extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * علاقة المدينة بالمستشفيات
     * المدينة الواحدة تضم العديد من المستشفيات
     */
    public function hospitals(): HasMany
    {
        return $this->hasMany(Hospital::class);
    }

    /**
     * علاقة المدينة بالمتبرعين
     * المدينة الواحدة تضم العديد من المتبرعين
     */
    public function donors(): HasMany
    {
        return $this->hasMany(Donor::class);
    }

    /**
     * علاقة المدينة بالمرضى
     * المدينة الواحدة تضم العديد من المرضى المسجلين
     */
    public function patients(): HasMany
    {
        return $this->hasMany(Patient::class);
    }

    /**
     * علاقة المدينة بطلبات الاستغاثة
     * المدينة الواحدة يتم فيها إنشاء العديد من طلبات الدم
     */
    public function bloodRequests(): HasMany
    {
        return $this->hasMany(BloodRequest::class);
    }
}
