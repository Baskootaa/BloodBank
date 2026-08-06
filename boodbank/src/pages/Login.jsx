import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios'; // ✅ استبدال axios بالمحرك المركزي المربوط بالـ Production

const Login = ({ setIsAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ إرسال الطلب عبر api واستخدام المسار النسبي /login
      const response = await api.post('/login', {
        email: email.trim(),
        password: password
      });

      const token = response.data.access_token || response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('isLogged', 'true');
        setIsAuth(true);

        Swal.fire({ 
          icon: 'success', 
          title: 'تم الدخول بنجاح', 
          timer: 1500, 
          showConfirmButton: false 
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({ 
        icon: 'error', 
        title: 'فشل الدخول', 
        text: error.response?.data?.message || 'تأكد من الحساب أو كلمة السر' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f40051] p-6 font-arabic" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-8 text-gray-800">تسجيل الدخول</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full p-4 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-red-500 font-bold text-right"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="كلمة السر"
              className="w-full p-4 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-red-500 font-bold text-right"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-[#f40051] text-white rounded-xl font-black text-lg shadow-lg hover:bg-[#d90048] transition-all"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
