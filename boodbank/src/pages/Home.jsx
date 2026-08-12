import { useState } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaTrash, FaHospital, FaTint, FaCheckCircle, FaCogs, FaRocket, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';

// استلام searchTerm كـ Props من الأب (App.jsx) لضمان عمل البحث العام
const Home = ({ donors = [], hospitals = [], bloodRequests = [], deleteDonor, isAuth, searchTerm = '' }) => {
  const [selectedType, setSelectedType] = useState(''); 
  const [activeTab, setActiveTab] = useState('donors'); 

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // تنظيف نص البحث وتوحيد الهمزات لضمان أفضل نتيجة بحث بالعربي
  const normalizeArabic = (text) => {
    return text?.toString()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .trim() || "";
  };

  const term = normalizeArabic(searchTerm);

  // 1. فلترة المتبرعين
  const filteredDonors = donors.filter(donor => {
    const name = normalizeArabic(donor.name || donor.firstName || "");
    const bloodType = donor.blood_type || donor.bloodType || "";
    const matchesSearch = name.includes(term);
    const matchesType = selectedType === '' || bloodType === selectedType;
    return matchesSearch && matchesType;
  });

  // 2. فلترة المستشفيات
  const filteredHospitals = hospitals.filter(h => {
    if (!term) return true;
    const name = normalizeArabic(h.name || h.hospital_name || "");
    const address = normalizeArabic(h.address || h.location || "");
    const cityName = normalizeArabic(h.city?.name || h.cityName || "");
    return name.includes(term) || address.includes(term) || cityName.includes(term);
  });

  // 3. فلترة الاستغاثات
  const filteredRequests = bloodRequests.filter(r => {
    const pName = normalizeArabic(r.name || r.patient_name || r.patientName || "");
    const hName = normalizeArabic(r.hospital_name || r.hospital?.name || "");
    const cityName = normalizeArabic(r.city?.name || r.hospital?.city?.name || "");
    return pName.includes(term) || hName.includes(term) || cityName.includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-50 font-arabic pb-20" dir="rtl">
      
      {/* قسم الهيدر والتبويبات الأصلي */}
      <div className="bg-white border-b px-8 py-12 text-center mb-10 shadow-sm">
        <h1 className="text-4xl font-black text-gray-800 mb-6">
            {activeTab === 'donors' ? 'قائمة المتبرعين بالدم 🩸' : 
             activeTab === 'hospitals' ? 'دليل المستشفيات 🏥' : 
             'طلبات الاستغاثة العاجلة 🆘'}
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setActiveTab('donors')} 
                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'donors' ? 'bg-[#f40051] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
              >
                المتبرعين
              </button>
              <button 
                onClick={() => setActiveTab('hospitals')} 
                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'hospitals' ? 'bg-[#f40051] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
              >
                المستشفيات
              </button>
              <button 
                onClick={() => setActiveTab('requests')} 
                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-[#f40051] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
              >
                الاستغاثات
              </button>
          </div>

          {activeTab === 'donors' && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button 
                  onClick={() => setSelectedType('')} 
                  className={`px-6 py-3 rounded-xl font-black ${selectedType === '' ? 'bg-[#f40051] text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  الكل
                </button>
                {bloodTypes.map(type => (
                  <button 
                    key={type} 
                    onClick={() => setSelectedType(type === selectedType ? '' : type)} 
                    className={`w-14 h-14 rounded-xl font-black flex items-center justify-center border-2 transition-all ${selectedType === type ? 'bg-[#f40051] border-[#f40051] text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-red-200'}`}
                  >
                    {type}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mb-20">
        
        {/* قسم المتبرعين */}
        {activeTab === 'donors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor) => (
                    <div key={donor.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all text-right relative group">
                        {/* زر حذف المتبرع للأدمن */}
                        {isAuth && deleteDonor && (
                          <button 
                            onClick={() => deleteDonor(donor.id)} 
                            className="absolute top-6 left-6 text-gray-300 hover:text-red-500 p-2 transition-colors"
                            title="حذف المتبرع"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#f40051] text-2xl font-black border-2 border-red-100">
                              {donor.blood_type || donor.bloodType}
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800 text-xl">{donor.name}</h3>
                                <p className="text-gray-400 font-bold text-sm">
                                  <FaMapMarkerAlt className="inline ml-1" /> 
                                  {donor.city?.name || donor.cityName || "غير محدد"}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex items-center justify-between">
                            <span className="text-gray-400 text-xs font-bold">رقم التواصل</span>
                            <span className="text-gray-800 font-black">{donor.phone}</span>
                        </div>
                        <a 
                          href={`tel:${donor.phone}`} 
                          className="w-full bg-[#f40051] text-white text-center py-4 rounded-2xl font-black block shadow-lg shadow-red-50 hover:bg-[#d00045] transition-all"
                        >
                          اتصل الآن
                        </a>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400 font-bold">لا يوجد نتائج لهذا البحث..</div>
                )}
            </div>
        )}

        {/* قسم المستشفيات */}
        {activeTab === 'hospitals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map(h => {
                        const totalBags = h.bloodStocks 
                          ? h.bloodStocks.reduce((sum, stock) => sum + (Number(stock.bags_quantity) || 0), 0) 
                          : (Number(h.total_bags_count) || 0);

                        return (
                            <div key={h.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:border-red-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 flex items-center justify-center rounded-xl text-xl">
                                      <FaHospital />
                                    </div>
                                    <h3 className="font-black text-gray-800 text-lg">{h.name || h.hospital_name}</h3>
                                </div>
                                <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
                                  <FaMapMarkerAlt className="text-blue-500 shrink-0" /> 
                                  {h.address || h.location || h.city?.name || "العنوان غير متوفر"}
                                </p>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">حالة المستشفى</span>
                                    {totalBags > 0 ? (
                                        <span className="text-green-500 text-xs font-black bg-green-50 px-3 py-1 rounded-full">متوفر مخزون</span>
                                    ) : (
                                        <span className="text-red-500 text-xs font-black bg-red-50 px-3 py-1 rounded-full">الرصيد فارغ</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-400 font-bold">لم نجد مستشفيات بهذا الاسم أو العنوان..</div>
                )}
            </div>
        )}

        {/* قسم الاستغاثات */}
        {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-red-50 hover:shadow-md transition-all">
                        <h3 className="font-black text-gray-800 text-lg mb-1">
                          الحالة: <span className="text-[#f40051]">{r.name || r.patient_name || r.patientName || "مريض"}</span>
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3 font-bold">
                          فصيلة الدم المطلوبة: <span className="text-red-500 text-lg">{r.blood_type || r.bloodType}</span>
                        </p>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <FaMapMarkerAlt className="text-[#f40051]" /> 
                          {r.city?.name || r.hospital?.city?.name || r.cityName || "مدينة غير محددة"}
                        </div>

                        <div className="bg-red-50 p-3 rounded-xl mb-4 flex items-center justify-between border border-red-100">
                            <span className="text-red-400 text-xs font-bold">رقم الطوارئ</span>
                            <span className="text-gray-800 font-black flex items-center gap-2" dir="ltr">
                              <FaPhoneAlt size={10} className="text-[#f40051]" /> {r.phone}
                            </span>
                        </div>

                        <a 
                          href={`tel:${r.phone}`} 
                          className="block text-center bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-[#f40051] transition-colors"
                        >
                          تواصل الآن
                        </a>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400 font-bold">لا يوجد استغاثات مطابقة للبحث..</div>
                )}
            </div>
        )}
      </div>

      {/* 🌳 قسم شجرة الدم التفاعلية وتقرير التقدم (تم نقله ليصبح في الأسفل فوق الفوتر مباشرة) */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-white rounded-[3.5rem] p-8 shadow-sm border border-red-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-50/30 to-transparent pointer-events-none"></div>
          
          <div className="text-center mb-10 relative z-10">
            <span className="bg-red-50 text-[#f40051] text-xs font-black px-4 py-1.5 rounded-full border border-red-100 uppercase tracking-widest inline-block mb-3">
              BloodBank Project Integrity
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">شجرة الدم وشفافية المشروع</h2>
            <p className="text-gray-400 font-bold text-sm mt-2">إدارة الأهداف الحيوية، المخاطر، ومتابعة حالة الإنجاز بدقة.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            
            {/* العمود الأيمن */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                  <FaCheckCircle />
                </div>
                <h3 className="text-base font-black text-gray-800 mb-2">1. Completed Work</h3>
                <ul className="space-y-2 text-xs font-bold text-gray-500 list-disc list-inside">
                  <li>Requirements analysis and core database schema design successfully completed.</li>
                  <li>Finalized UI/UX wireframes for main interface and login.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                  <FaCogs />
                </div>
                <h3 className="text-base font-black text-gray-800 mb-2">2. Work in Progress</h3>
                <ul className="space-y-2 text-xs font-bold text-gray-500 list-disc list-inside">
                  <li>Administrative dashboard development and database connection.</li>
                  <li>Implementation of real-time inventory tracking module.</li>
                </ul>
              </div>
            </div>

            {/* العمود الأوسط: شجرة الدم */}
            <div className="flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-white to-red-50/20 rounded-[3rem] border border-red-100 shadow-xl relative">
              <div className="w-24 h-24 bg-gradient-to-tr from-[#f40051] to-red-400 text-white rounded-full flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-red-200 animate-pulse mb-4">
                <FaTint />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">BLOODBANK INTEGRITY</h3>
              <p className="text-[11px] font-black text-[#f40051] uppercase tracking-widest mt-1 mb-4">Core Objectives & Risk Management</p>
              <div className="w-full bg-white p-4 rounded-2xl border border-red-50 text-[11px] font-bold text-gray-600 shadow-sm">
                🌳 ربط الأعضاء الحيوية للمنظومة بقاعدة بيانات مركزية آمنة.
              </div>
            </div>

            {/* العمود الأيسر */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                  <FaRocket />
                </div>
                <h3 className="text-base font-black text-gray-800 mb-2">3. Upcoming Tasks</h3>
                <ul className="space-y-2 text-xs font-bold text-gray-500 list-disc list-inside">
                  <li>Beginning security tests and strict input validation rules.</li>
                  <li>Preparing initial MVP build for user testing by next week.</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center font-black text-xl mb-4 shadow-inner">
                  <FaCalendarCheck />
                </div>
                <h3 className="text-base font-black text-gray-800 mb-2">4. Timeline & Status</h3>
                <ul className="space-y-2 text-xs font-bold text-gray-500 list-disc list-inside">
                  <li>Status: Running smoothly and fully On Track with schedule.</li>
                  <li>Milestone: Initial prototype delivery remains on schedule.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
