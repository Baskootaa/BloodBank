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
        'city_id',
        'stock'
    ];

    /**
     * العلاقة مع جدول المدن
     */
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    /**
     * العلاقة مع جدول مخزون الدم (blood_stocks)
     */
    public function bloodStocks()
    {
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
     * العلاقة مع طلبات الدم (Blood Requests)
     */
    public function bloodRequests()
    {
        return $this->hasMany(BloodRequest::class, 'hospital_id');
    }
}
