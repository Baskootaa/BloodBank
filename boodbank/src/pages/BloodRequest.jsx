import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios'; // ✅ استخدام محرك Axios الموحد
import Swal from 'sweetalert2';
import { FaPlus, FaPhoneAlt, FaHospital, FaTint, FaInfoCircle, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const BloodRequest = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  const location = useLocation();

  // تم تغيير patient_name إلى name ليطابق الموديل وقاعدة البيانات
  const [formData, setFormData] = useState({ 
    name: '', 
    blood_type: '', 
    hospital_id: '', 
    city_id: '', 
    phone: '', 
    bags_quantity: '',
    age: '' 
  });

  const fetchData = async () => {
    try {
      const [reqRes, cityRes, hospRes] = await Promise.all([
        api.get('/emergency-requests'),
        api.get('/cities'),
        api.get('/hospitals')
      ]);
      
      if (reqRes.data) setRequests(reqRes.data);
      if (cityRes.data) setCities(cityRes.data);
      if (hospRes.data) setHospitals(hospRes.data);
      
      setLoading(false);
    } catch (error) { 
      console.error("Fetch error details:", error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
    if (location.state?.openForm) {
      setShowForm(true);
    }
  }, [location]);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      // إرسال البيانات (الآن تشمل bags_quantity و hospital_id بشكل صحيح)
      const response = await api.post('/emergency-requests', formData);
      
      if (response.data.status === 'success') {
        Swal.fire({ icon: 'success', title: 'تم النشر بنجاح', text: 'طلبك الآن قيد المراجعة' });
        setShowForm(false);
        // إعادة تعيين الفورم بالأسماء الجديدة
        setFormData({ name: '', blood_type: '', hospital_id: '', city_id: '', phone: '', bags_quantity: '', age: '' });
        fetchData();
      }
    } catch (error) { 
        // عرض رسالة الخطأ القادمة من السيرفر للتأكد من سبب المشكلة
      Swal.fire({ 
        icon: 'error', 
        title: 'خطأ في البيانات', 
        text: error.response?.data?.error || 'تأكد من ملء جميع الحقول بشكل صحيح' 
      }); 
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.blood_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHospitals = hospitals.filter(h => String(h.city_id) === String(formData.city_id));

  if (loading) return <div className="text-center py-20 font-black">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-arabic" dir="rtl">
      <div className="max-w-6xl mx-auto text-right">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-4">طلبات استغاثة عاجلة 🚨</h1>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
            <button 
              onClick={() => setShowForm(!showForm)}
              className={`${showForm ? 'bg-gray-600' : 'bg-[#10b981]'} text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all`}
            >
              <FaPlus /> {showForm ? 'إغلاق نافذة الإضافة' : 'إضافة حالة استغاثة جديدة'}
            </button>

            <div className="relative w-full md:w-96 group">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10b981] transition-colors" />
              <input
                type="text"
                placeholder="ابحث باسم المريض أو فصيلة الدم..."
                className="w-full pr-12 pl-4 py-4 bg-white rounded-2xl shadow-lg border-2 border-transparent focus:border-[#10b981] outline-none font-bold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {showForm && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-2xl mb-16 border-2 border-green-100 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-[#10b981] mb-8 text-center">بيانات الحالة الجديدة</h2>
            <form onSubmit={handlePublish} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="اسم المريض" 
                  className="p-4 bg-gray-50 rounded-2xl border w-full font-bold" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <select className="p-4 bg-gray-50 rounded-2xl border w-full font-bold" required value={formData.blood_type} onChange={(e) => setFormData({...formData, blood_type: e.target.value})} >
                  <option value="">اختر الفصيلة</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="number" 
                  min="1" 
                  onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()}
                  placeholder="عمر المريض" 
                  className="p-4 bg-gray-50 rounded-2xl border w-full font-bold text-right" 
                  required 
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})} 
                />
                <select 
                  className="p-4 bg-gray-50 rounded-2xl border w-full font-bold" 
                  required 
                  value={formData.city_id} 
                  onChange={(e) => setFormData({...formData, city_id: e.target.value, hospital_id: ''})}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                  className="p-4 bg-gray-50 rounded-2xl border w-full font-bold" 
                  required 
                  value={formData.hospital_id} 
                  onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
                  disabled={!formData.city_id}
                >
                  <option value="">اختر المستشفى</option>
                  {filteredHospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))
                  }
                </select>
                <input 
                  type="number" 
                  min="1"
                  onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()}
                  placeholder="عدد الأكياس" 
                  className="p-4 bg-gray-50 rounded-2xl border font-bold" 
                  required 
                  value={formData.bags_quantity} 
                  onChange={(e) => setFormData({...formData, bags_quantity: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input type="tel" placeholder="رقم الهاتف" className="p-4 bg-gray-50 rounded-2xl border text-left font-bold" dir="ltr" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-black text-xl shadow-lg mt-4 transition-transform active:scale-95">نشر الاستغاثة</button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border-r-8 border-[#f40051] flex flex-col justify-between hover:shadow-xl transition-all h-full group">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-800 line-clamp-1">{req.name}</h3>
                  <div className="w-14 h-14 bg-[#f40051] text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-lg group-hover:scale-110 transition-transform">{req.blood_type}</div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                    <FaCalendarAlt className="text-[#f40051]" /> العمر: {req.age ? `${req.age} سنة` : 'غير محدد'}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                    <FaHospital className="text-[#f40051]" /> المستشفى: {req.hospital?.name || 'غير محدد'}
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 font-bold text-sm"><FaTint className="text-[#f40051]" /> المطلوب: {req.bags_quantity} كيس</div>
                  <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                    <FaInfoCircle className="text-[#f40051]" /> الحالة: 
                    <span className={`mr-2 px-3 py-1 rounded-lg text-xs font-black ${
                      req.status === 'approved' || req.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-orange-100 text-orange-700'}`}>
                      {req.status === 'approved' || req.status === 'accepted' ? 'تمت الموافقة' : req.status === 'rejected' ? 'تم الرفض' : 'قيد الانتظار'}
                    </span>
                  </div>
                </div>
              </div>

              <a href={`tel:${req.phone}`} className="w-full py-4 rounded-2xl font-black bg-[#f40051] text-white flex justify-center items-center gap-2 hover:bg-[#d40046] transition-colors shadow-lg">
                <FaPhoneAlt /> {req.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloodRequest; 
