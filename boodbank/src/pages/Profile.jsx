import React, { useState, useEffect } from 'react';
import { FaUserShield, FaKey, FaEnvelope, FaUser, FaSave } from 'react-icons/fa';
import api from '../api/axios';
import Swal from 'sweetalert2';

const Profile = () => {
  // 1. الحالة الأولية للبيانات (نحاول نجيب من التخزين المحلي أولاً)
  const [userData, setUserData] = useState({ 
    name: localStorage.getItem('user_name') || 'BASKOTA', 
    email: localStorage.getItem('user_email') || 'Baskota@gmail.com' 
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [loading, setLoading] = useState(false);

  // 2. جلب البيانات من السيرفر
  const fetchProfileData = async () => {
    try {
      const response = await api.get('/user'); // تأكد من الـ endpoint الصحيح في الباك إند
      const data = response.data;
      if (data) {
        setUserData({ name: data.name, email: data.email });
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_email', data.email);
      }
    } catch (error) {
      console.error("تعذر جلب البيانات، سيتم استخدام البيانات المحلية");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // 3. دالة تحديث كلمة المرور
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      return Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'كلمة المرور الجديدة غير متطابقة',
        confirmButtonColor: '#f40051'
      });
    }

    setLoading(true);
    try {
      // لاحظ: تأكد أن المسار مطابق لما وضعناه في routes/api.php
      await api.post('/admin/update-password', passwordData);
      
      Swal.fire({
        icon: 'success',
        title: 'تم بنجاح',
        text: 'تم تحديث كلمة المرور بنجاح',
        confirmButtonColor: '#f40051'
      });
      
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'فشل التحديث',
        text: error.response?.data?.message || 'تأكد من كلمة المرور الحالية',
        confirmButtonColor: '#f40051'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 text-right" dir="rtl">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <FaUserShield className="text-[#f40051]" /> إعدادات الحساب
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* الكارت الجانبي: معلومات العرض */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border shadow-sm h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-5xl text-slate-300 mb-4 border-4 border-white shadow-xl">
              <FaUser />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase">{userData.name}</h3>
            <span className="px-4 py-1 bg-red-50 text-[#f40051] rounded-full text-[10px] font-black mt-2">ADMIN</span>
            
            <div className="w-full mt-8 space-y-4 text-sm font-bold text-slate-500">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <FaEnvelope className="text-slate-400 shrink-0" />
                <span className="truncate ml-2 text-left" title={userData.email}>{userData.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* الكارت الأساسي: فورم التغيير */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border shadow-sm">
          <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <FaKey className="text-blue-500" /> تأمين الحساب
          </h4>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase">كلمة المرور الحالية</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all text-left font-sans"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all text-left font-sans"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all text-left font-sans"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 w-full md:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f40051]'}`}
            >
              <FaSave /> {loading ? 'جاري الحفظ...' : 'حفظ التغييرات الأمنية'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;