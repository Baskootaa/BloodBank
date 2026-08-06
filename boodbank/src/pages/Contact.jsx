import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6 font-arabic" dir="rtl">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">تواصل معنا</h1>
        <p className="text-gray-500 font-bold">نحن هنا للإجابة على استفساراتكم على مدار الساعة</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <a href="mailto:mazen01289elbasyouny@gmail.com" className="bg-white border-2 border-blue-500 rounded-3xl p-10 text-center shadow-xl transition-all hover:scale-105 hover:bg-blue-50">
          <div className="text-blue-500 text-4xl mb-6 flex justify-center"><FaEnvelope /></div>
          <h3 className="text-xl font-black mb-2">البريد الإلكتروني</h3>
          <p className="text-gray-600 font-bold text-sm">mazen01289elbasyouny@gmail.com</p>
        </a>

        <a href="https://wa.me/201228249057" target="_blank" rel="noreferrer" className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm transition-all hover:scale-105 hover:bg-green-50 hover:border-green-200">
          <div className="text-green-500 text-4xl mb-6 flex justify-center"><FaWhatsapp /></div>
          <h3 className="text-xl font-black mb-2">واتساب</h3>
          <p className="text-gray-600 font-bold">01228249057</p>
        </a>

        <a href="tel:01228249057" className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm transition-all hover:scale-105 hover:bg-red-50 hover:border-red-200">
          <div className="text-red-500 text-4xl mb-6 flex justify-center"><FaPhoneAlt /></div>
          <h3 className="text-xl font-black mb-2">اتصال هاتفي</h3>
          <p className="text-gray-600 font-bold">01228249057</p>
        </a>
      </div>

      <div className="max-w-6xl mx-auto bg-gray-50 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 bg-white rounded-[2rem] p-12 shadow-sm text-center border border-gray-100 w-full">
          <div className="text-red-600 text-5xl mb-6 flex justify-center"><FaMapMarkerAlt /></div>
          <p className="text-gray-800 text-xl font-black">المقر الرئيسي: المنصورة، مصر</p>
        </div>

        <div className="flex-1 text-right w-full">
          <h2 className="text-3xl font-black text-red-600 mb-6">تابعنا على السوشيال ميديا</h2>
          <p className="text-gray-600 font-bold mb-8 text-lg">انضم لمجتمعنا على منصات التواصل الاجتماعي لتصلك آخر أخبار حملات التبرع والحالات العاجلة.</p>
          <div className="flex gap-4 justify-end">
            <a href="https://www.facebook.com/share/1bsh2sceU4/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition-all hover:rotate-6">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/mazen_elbasyouny_?igsh=ZmNkYndjb3U1cTVm&utm_source=qr" target="_blank" rel="noreferrer" className="w-14 h-14 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-all hover:-rotate-6">
              <FaInstagram />
            </a>
            <a href="mailto:mazen01289elbasyouny@gmail.com" className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg hover:bg-red-600 transition-all">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;