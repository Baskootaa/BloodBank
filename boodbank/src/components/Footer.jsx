import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t-4 border-red-600 pt-16 pb-10 mt-20" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="text-right">
            <h2 className="text-3xl font-black text-red-600 mb-6 flex items-center gap-2">
              🩸 نبض الحياة
            </h2>
            <p className="text-gray-400 leading-relaxed font-bold text-lg">
              منصة تهدف لربط المتبرعين بالمحتاجين للدم في أسرع وقت ممكن. ساهم معنا في إنقاذ حياة.
            </p>
          </div>

          <div className="text-right flex flex-col gap-4">
            <h3 className="text-xl font-black text-white mb-2 border-b border-gray-800 pb-2 inline-block w-fit">روابط سريعة</h3>
            <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors font-bold">الرئيسية</Link>
            <Link to="/register" className="text-gray-400 hover:text-red-500 transition-colors font-bold">تسجيل متبرع</Link>
            <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors font-bold">اتصل بنا</Link>
          </div>

          <div className="text-right">
            <h3 className="text-xl font-black text-white mb-6">تابعنا على</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1bsh2sceU4/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg border border-gray-700">
                <FaFacebookF size={20} />
              </a>
              <a href="https://www.instagram.com/mazen_elbasyouny_?igsh=ZmNkYndjb3U1cTVm&utm_source=qr" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-pink-500 hover:bg-pink-600 hover:text-white transition-all shadow-lg border border-gray-700">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/mazen-albasyouny" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 hover:bg-blue-700 hover:text-white transition-all shadow-lg border border-gray-700">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm font-bold tracking-wide">
            جميع الحقوق محفوظة © {new Date().getFullYear()} نبض الحياة | صنع بكل حب لإنقاذ الأرواح
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;