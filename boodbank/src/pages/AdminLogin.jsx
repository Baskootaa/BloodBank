import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios'; // ✅ استيراد النسخة المركزية المربوطة بالسيرفر المرفوع

const AdminLogin = ({ setIsAuth, isAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (isAuth) return <Navigate to="/dashboard" />;

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    // مسح أي توكن قديم لتجنب التداخل
    localStorage.removeItem('token');
    localStorage.removeItem('isLogged');

    try {
      // ✅ استخدام api.post مباشرة وبمسار نسبي فقط دون الحاجة لكتابة الدومين
      const response = await api.post('/login', {
        email: email.trim(),
        password: password
      }, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.status === 200) {
        const token = response.data.access_token || response.data.token;
        const userData = response.data.user;

        if (token) {
          localStorage.setItem('token', token); 
          localStorage.setItem('isLogged', 'true');
          
          if (userData) {
            const fullName = userData.name || (userData.first_name + ' ' + userData.last_name);
            localStorage.setItem('user_name', fullName);
            localStorage.setItem('user_email', userData.email);
            localStorage.setItem('user_role', userData.role);

            setIsAuth(true);
            
            Swal.fire({
              icon: 'success',
              title: `مرحباً ${fullName}`,
              text: userData.role === 'admin' 
                ? 'جاري فتح لوحة التحكم للـ Admin...' 
                : 'تم تسجيل الدخول بنجاح، جاري التحويل...',
              timer: 1500,
              showConfirmButton: false,
              customClass: { popup: 'rounded-[2rem]' }
            });
          }
          
          if (userData?.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response);
      
      let errorMsg = 'تأكد من الحساب أو كلمة السر';
      if (error.response?.status === 401) {
        errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'فشل الدخول',
        text: errorMsg,
        confirmButtonColor: '#f40051',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-arabic p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-[3rem] p-12 border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-black text-white text-center mb-8">دخول النظام</h2>
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            className="w-full p-5 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-[#f40051] text-white text-right font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="كلمة السر" 
            className="w-full p-5 bg-white/10 border border-white/10 rounded-2xl outline-none focus:border-[#f40051] text-white text-right font-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-[#f40051] text-white font-black py-5 rounded-2xl hover:scale-105 transition-all text-xl shadow-lg">
            دخول النظام
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-white/60 font-bold">
            ليس لديك حساب؟{' '}
            <button 
              onClick={() => navigate('/signup')} 
              className="text-[#f40051] hover:underline font-black transition-all"
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
