import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTint, FaCheckCircle, FaHospital, FaBox } from 'react-icons/fa';
import api from '../api/axios'; // ✅ استبدال axios بالمحرك المركزي

const Register = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [bloodType, setBloodType] = useState('A+');
  const [cityId, setCityId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [bagsQuantity, setBagsQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);

  // جلب المدن عند تحميل المكون لضمان ظهورها دائماً
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get('/cities');
        setCities(response.data);
      } catch (error) {
        console.error("خطأ في جلب المدن:", error);
      }
    };
    fetchCities();
  }, []);

  // جلب المستشفيات بناءً على المدينة المختارة فقط
  useEffect(() => {
    const fetchHospitals = async () => {
      if (!cityId) {
        setHospitals([]);
        return;
      }
      
      setHospitalsLoading(true);
      try {
        const response = await api.get(`/hospitals?city_id=${cityId}`);
        setHospitals(response.data);
      } catch (error) {
        console.error("خطأ في جلب المستشفيات:", error);
        Swal.fire('خطأ', 'فشل في تحميل قائمة المستشفيات', 'error');
      } finally {
        setHospitalsLoading(false);
      }
    };

    fetchHospitals();
  }, [cityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCity = cities.find(c => c.id === parseInt(cityId));
    const selectedHospital = hospitals.find(h => h.id === parseInt(hospitalId));

    const donorData = {
      name,
      blood_type: bloodType,
      city_id: cityId,
      hospital_id: hospitalId,
      bags_quantity: bagsQuantity,
      phone,
      age: parseInt(age)
    };

    try {
      const response = await api.post('/donors', donorData);

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: '<span style="font-family: inherit; font-weight: 900;">تم تسجيلك كبطل! 🎉</span>',
          html: `
            <div style="font-family: inherit; text-align: center;">
              <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 1rem;">شكراً لك يا <b>${name}</b>، بياناتك قيد المراجعة الآن.</p>
              <div style="background: #fff1f2; padding: 1rem; border-radius: 1.2rem; border: 2px dashed #f40051; display: inline-block; width: 100%;">
                <p style="color: #f40051; font-weight: 900; margin: 5px 0;">الفصيلة: ${bloodType} | الكمية: ${bagsQuantity} كيس</p>
                <p style="color: #1e293b; font-weight: bold; font-size: 0.9rem;">المكان: ${selectedHospital?.name || ''} - ${selectedCity?.name || ''}</p>
              </div>
            </div>
          `,
          icon: 'success',
          iconColor: '#f40051',
          confirmButtonText: 'عرض قائمة المتبرعين',
          confirmButtonColor: '#f40051',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-[2.5rem] p-8',
            confirmButton: 'rounded-2xl px-10 py-4 font-black text-lg'
          }
        }).then(() => {
          navigate('/dashboard'); 
        });
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      const errorMsg = error.response?.data?.message || "فشل تسجيل البيانات، تأكد من إكمال جميع الحقول بشكل صحيح";
      Swal.fire({
        icon: 'error',
        title: 'فشل التسجيل',
        text: errorMsg,
        confirmButtonColor: '#f40051',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-arabic" dir="rtl">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-2 bg-[#f40051]"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 transition-transform hover:scale-110">
            <FaTint />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter">بيانات المتبرع</h2>
          <p className="text-slate-400 font-bold mt-2">انضم لـ <span className="text-[#f40051]">BASKOTA</span> وأنقذ حياة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* الاسم */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 mr-2 uppercase">الاسم بالكامل</label>
            <input required type="text" placeholder="مثلاً: مازن محمد" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-bold text-right transition-all" onChange={(e) => setName(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* فصيلة الدم */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 mr-2">فصيلة الدم</label>
              <select required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-black text-center transition-all" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* المدينة */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 mr-2">المدينة</label>
              <select required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-bold text-right transition-all" value={cityId} onChange={(e) => {
                setCityId(e.target.value);
                setHospitalId('');
              }}>
                <option value="">اختر المدينة</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* المستشفى */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 mr-2 flex items-center gap-1"><FaHospital className="text-[#f40051]"/> المستشفى</label>
              <select required disabled={!cityId || hospitalsLoading} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-bold text-right transition-all disabled:opacity-50" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
                <option value="">{hospitalsLoading ? 'جارِ التحميل...' : 'اختر المستشفى'}</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* الكمية */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 mr-2 flex items-center gap-1"><FaBox className="text-[#f40051]"/> كمية التبرع (كيس)</label>
              <input 
                required 
                type="number" 
                min="1" 
                max="5" 
                value={bagsQuantity} 
                onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-black text-center transition-all" 
                onChange={(e) => setBagsQuantity(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* العمر */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 mr-2">العمر</label>
              <input 
                required 
                type="number" 
                min="18" 
                max="65"
                placeholder="21" 
                onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-bold text-right transition-all" 
                onChange={(e) => setAge(e.target.value)} 
              />
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 mr-2">رقم الهاتف</label>
              <input required type="tel" placeholder="01xxxxxxxxx" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#f40051] focus:bg-white outline-none font-sans font-black text-right transition-all" onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#f40051] text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-slate-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4">
            تأكيد التبرع <FaCheckCircle />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
