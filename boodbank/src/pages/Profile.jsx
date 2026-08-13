import React, { useState, useEffect } from 'react';
import { FaUserShield, FaKey, FaEnvelope, FaUser, FaSave, FaPhone, FaUsers, FaTrash } from 'react-icons/fa';
import api from '../api/axios';
import Swal from 'sweetalert2';

const Profile = () => {
  // حالة المستخدمين والقائمة المنسدلة للأدمن
  const [usersList, setUsersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // التحقق مما إذا كان المستخدم الحالي هو الأدمن
  const isAdmin = localStorage.getItem('isLogged') === 'true';
  
  // بيانات المستخدم المحدد للتعديل
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    new_password: ''
  });

  // بيانات تغيير كلمة المرور الخاصة بالحساب الحالي
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [loading, setLoading] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  // 1. جلب قائمة كل المستخدمين للأدمن
  const fetchUsers = async () => {
    if (!isAdmin) return; // جلب المستخدمين فقط إذا كان أدمن
    try {
      const response = await api.get('/admin/users');
      setUsersList(response.data);
    } catch (error) {
      console.error("تعذر جلب قائمة المستخدمين", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  // 2. عندما يختار الأدمن مستخدم من القائمة المنسدلة
  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);

    if (!userId) {
      setEditFormData({ name: '', email: '', phone: '', role: 'user', new_password: '' });
      return;
    }

    const foundUser = usersList.find(u => u.id.toString() === userId.toString());
    if (foundUser) {
      setEditFormData({
        name: foundUser.name || '',
        email: foundUser.email || '',
        phone: foundUser.phone || '',
        role: foundUser.role || 'user',
        new_password: ''
      });
    }
  };

  // 3. حفظ تعديلات المستخدم المختار (تغيير الدور، الاسم، الإيميل، إلخ)
  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      return Swal.fire('تنبيه', 'الرجاء اختيار مستخدم أولاً من القائمة', 'warning');
    }

    setSavingUser(true);
    try {
      await api.put(`/admin/users/${selectedUserId}`, editFormData);
      Swal.fire({
        icon: 'success',
        title: 'تم بنجاح',
        text: 'تم تحديث بيانات وصلاحية المستخدم بنجاح',
        confirmButtonColor: '#f40051'
      });
      // تحديث القائمة المحلية
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'فشل التحديث',
        text: error.response?.data?.message || 'حدث خطأ أثناء تحديث بيانات المستخدم',
        confirmButtonColor: '#f40051'
      });
    } finally {
      setSavingUser(false);
    }
  };

  // 4. حذف المستخدم المحدد بواسطة الأدمن
  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      return Swal.fire('تنبيه', 'الرجاء اختيار مستخدم أولاً من القائمة للحذفه', 'warning');
    }

    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن يمكنك تراجع عن عملية حذف هذا المستخدم!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f40051',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، قم بالحذف',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      setDeletingUser(true);
      try {
        await api.delete(`/admin/users/${selectedUserId}`);
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف المستخدم بنجاح',
          confirmButtonColor: '#f40051'
        });
        
        // إعادة تعيين الخيارات وتحديث القائمة
        setSelectedUserId('');
        setEditFormData({ name: '', email: '', phone: '', role: 'user', new_password: '' });
        fetchUsers();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'فشل الحذف',
          text: error.response?.data?.message || 'حدث خطأ أثناء محاولة حذف المستخدم',
          confirmButtonColor: '#f40051'
        });
      } finally {
        setDeletingUser(false);
      }
    }
  };

  // 5. دالة تحديث كلمة المرور للحساب الحالي
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
        <FaUserShield className="text-[#f40051]" /> إعدادات النظام والبروفايل
      </h2>

      {/* قسم تعديل الحسابات والصلاحيات (يظهر للأدمن فقط، بينما الموظف والمستخدم العادي تظهر له صفحة البروفايل وتغيير الباسورد فقط) */}
      {isAdmin && (
        <div className="bg-white p-8 rounded-[3rem] border shadow-sm mb-10">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <FaUsers className="text-[#f40051]" /> تعديل الحسابات وصلاحيات المستخدمين (البروفايل)
          </h3>

          <div className="mb-6">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">اختر المستخدم للتعديل على بياناته أو صلاحيته أو حذفه:</label>
            <select 
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all font-bold text-slate-700"
              value={selectedUserId}
              onChange={handleUserSelect}
            >
              <option value="">-- اختر مستخدم من القائمة --</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email}) - [{u.role}]
                </option>
              ))}
            </select>
          </div>

          {selectedUserId && (
            <form onSubmit={handleUpdateUserSubmit} className="space-y-6 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2 uppercase">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all font-bold"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2 uppercase">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all text-left font-sans font-bold"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2 uppercase">رقم المحمول (الهاتف)</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all text-left font-sans font-bold"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2 uppercase">الصفة / المسمى (Role)</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all font-black text-[#f40051]"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                  >
                    <option value="user">مستخدم عادي (User)</option>
                    <option value="employee">موظف (Employee)</option>
                    <option value="admin">مدير النظام (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد التغيير)</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-100 transition-all text-left font-sans"
                  value={editFormData.new_password}
                  onChange={(e) => setEditFormData({...editFormData, new_password: e.target.value})}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={savingUser}
                  className={`flex items-center justify-center gap-3 bg-[#f40051] text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 w-full md:w-auto ${savingUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-900'}`}
                >
                  <FaSave /> {savingUser ? 'جاري الحفظ...' : 'حفظ البيانات والصلاحية'}
                </button>

                <button 
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={deletingUser}
                  className={`flex items-center justify-center gap-3 bg-red-100 text-red-600 px-8 py-4 rounded-2xl font-black transition-all shadow-sm active:scale-95 w-full md:w-auto ${deletingUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:text-white'}`}
                >
                  <FaTrash /> {deletingUser ? 'جاري الحذف...' : 'حذف هذا المستخدم'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* قسم تأمين الحساب الشخصي (تغيير كلمة المرور للحساب الحالي - متاح للجميع) */}
      <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
        <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          <FaKey className="text-blue-500" /> تغيير كلمة المرور لحسابك الشخصي
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
            <FaSave /> {loading ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
