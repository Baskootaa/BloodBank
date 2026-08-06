import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaTint, FaEnvelope, FaLock, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api/axios'; // ✅ استخدام المحرك المركزي المربوط بالـ Production

const SignUp = ({ handleSignUp }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    blood_type: 'A+',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمة المرور
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'كلمة المرور غير متطابقة' });
    }

    setLoading(true);
    
    // تجميع البيانات
    const submissionData = {
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      phone: formData.phone.trim(),
      age: formData.age,
      blood_type: formData.blood_type
    };

    try {
      let success = false;

      // لو الـ Prop الممرر موجود يتم استدعاؤه، وإلا يتم تنفيذ الطلب المباشر
      if (typeof handleSignUp === 'function') {
        success = await handleSignUp(submissionData);
      } else {
        const response = await api.post('/register', submissionData);
        if (response.status === 200 || response.status === 201) {
          success = true;
        }
      }

      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'تم إنشاء الحساب بنجاح',
          text: 'يمكنك الآن تسجيل الدخول',
          confirmButtonColor: '#f40051'
        }).then(() => navigate('/admin-login'));
      }
    } catch (error) {
      console.error("SignUp Error:", error.response?.data);
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً';
      Swal.fire({
        icon: 'error',
        title: 'فشل إنشاء الحساب',
        text: errorMsg,
        confirmButtonColor: '#f40051'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] py-10 px-4 font-arabic" dir="rtl">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-700 overflow-hidden p-8 md:p-12">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">إنشاء حساب جديد</h2>
          <p className="text-slate-400">سجل بياناتك لتنضم إلى شبكة المتبرعين</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* الاسم الأول والأخير */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <FaUser className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="text" 
                placeholder="الاسم الأول" 
                value={formData.firstName}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
              />
            </div>
            <div className="relative">
              <FaUser className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="text" 
                placeholder="الاسم الأخير" 
                value={formData.lastName}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
              />
            </div>
          </div>

          {/* السن ورقم التليفون */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <FaCalendarAlt className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="number" 
                placeholder="العمر" 
                value={formData.age}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, age: e.target.value})} 
              />
            </div>
            <div className="relative">
              <FaPhoneAlt className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="tel" 
                placeholder="رقم التليفون" 
                value={formData.phone}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
          </div>

          {/* نوع الدم والايميل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <FaTint className="absolute right-4 top-4 text-[#f40051]" />
              <select 
                value={formData.blood_type}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
              >
                {bloodTypes.map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
              </select>
            </div>
            <div className="relative">
              <FaEnvelope className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="email" 
                placeholder="البريد الإلكتروني" 
                value={formData.email}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          {/* كلمة المرور وتأكيدها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <FaLock className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="password" 
                placeholder="كلمة المرور" 
                value={formData.password}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
            <div className="relative">
              <FaLock className="absolute right-4 top-4 text-slate-500" />
              <input 
                required 
                type="password" 
                placeholder="تأكيد كلمة المرور" 
                value={formData.confirmPassword}
                className="w-full pr-12 p-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl text-white outline-none focus:border-[#f40051] transition-all"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              />
            </div>
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#f40051] hover:bg-[#d00045] text-white py-4 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'جارٍ المعالجة...' : 'إنشاء الحساب الآن'}
          </button>

          <div className="text-center mt-6">
            <span className="text-slate-400">لديك حساب بالفعل؟ </span>
            <Link to="/admin-login" className="text-[#f40051] font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
