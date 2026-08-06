import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaUserPlus, FaChartLine, FaUserShield, FaSearch } from 'react-icons/fa';

const Navbar = ({ isAuth, setIsAuth, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  // جلب البيانات المخزنة للتحقق من الرتبة والاسم
  const userRole = localStorage.getItem('user_role');
  const userName = localStorage.getItem('user_name') || 'مستخدم';

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('user_name'); 
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role'); // مسح الرتبة عند الخروج
    localStorage.removeItem('token');
    setIsAuth(false);
    navigate('/home');
  };

  return (
    <nav className="bg-[#f40051] text-white px-8 py-4 sticky top-0 z-50 shadow-lg font-arabic" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* اللوجو */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="text-4xl border-2 border-white rounded-full p-1 transition-transform group-hover:scale-110">
            <FaHeartbeat className="animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-tighter hidden md:block">حياتكم تهمنا</span>
        </Link>

        {/* خانة البحث المركزية */}
        <div className="flex-grow max-w-md relative group">
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="ابحث هنا (مستشفى، متبرع، مدينة)..." 
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pr-12 pl-4 outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder:text-white/50 text-sm"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* الروابط */}
        <div className="hidden lg:flex items-center gap-6 font-bold text-sm flex-shrink-0">
          <Link to="/home" className="hover:text-red-200 transition-colors">الصفحة الرئيسية</Link>
          <Link to="/blood-request" className="hover:text-red-200 transition-colors">طلبات عاجلة</Link>
          
          <Link to="/register" className="flex items-center gap-2 hover:text-red-200 transition-colors">
            <FaUserPlus className="text-lg" />
            <span>تسجيل متبرع</span>
          </Link>

          {isAuth && (
            <div className="flex items-center gap-3">
              {/* لوحة الإحصائيات تظهر فقط للأدمن */}
              {userRole === 'admin' && (
                <Link to="/dashboard" className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30">
                  <FaChartLine />
                  <span>الإحصائيات</span>
                </Link>
              )}
              
              {/* التعديل هنا: تم تغيير المسار لـ /settings ليتوافق مع App.jsx */}
              <Link to="/settings" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                <FaUserShield />
                <span>الإعدادات</span>
              </Link>
            </div>
          )}

          <Link to="/contact" className="hover:text-red-200 transition-colors">اتصل بنا</Link>
        </div>

        {/* أزرار الدخول والخروج */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {!isAuth ? (
            <div className="flex gap-2">
              <Link to="/admin-login" className="border-2 border-white rounded-full px-6 py-2 font-black text-sm hover:bg-white hover:text-[#f40051] transition-all shadow-md">
                دخول
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-[10px] font-black opacity-80 text-right">
                <p className="leading-none">مرحباً بك</p>
                <p>{userRole === 'admin' ? 'مسؤول النظام' : userName}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-white text-[#f40051] px-6 py-2 rounded-full font-black text-sm hover:bg-red-50 hover:shadow-lg transition-all active:scale-95"
              >
                خروج
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;