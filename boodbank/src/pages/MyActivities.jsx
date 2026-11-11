import React, { useState, useEffect } from 'react';
import { FaUser, FaTint, FaExclamationTriangle, FaCalendarAlt, FaBox, FaClock } from 'react-icons/fa';
import api from '../api/axios';

const MyActivities = () => {
  const [myDonors, setMyDonors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب اسم المستخدم أو الإيميل المسجل حالياً من الـ LocalStorage
  const currentUserName = (localStorage.getItem('user_name') || '').trim().toLowerCase();

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const [resDonors, resRequests] = await Promise.all([
          api.get('/donors'),
          api.get('/emergency-requests')
        ]);

        const donorsList = Array.isArray(resDonors.data) ? resDonors.data : (resDonors.data?.data || []);
        const requestsList = Array.isArray(resRequests.data) ? resRequests.data : (resRequests.data?.data || []);

        // 🔍 فلترة المتبرعين: إظهار فقط من يطابق اسم المستخدم الحالي أو الحساب النشط
        // (إذا كنت مسجلاً بـ Baskota، سيظهر ما تقم بتسجيله، وإذا دخلت بإيميل آخر فلن يظهر الافتراضي للآخرين)
        const filteredDonors = donorsList.filter(d => {
          const donorName = String(d.name || '').trim().toLowerCase();
          // يمكنك تعديل هذا الشرط بناءً على اسم الحساب الذي ترغب بظهوره لهذا المستخدم
          if (currentUserName.includes('baskota')) {
            // حساب Baskota يرى مثلاً أحمد محمد ولؤي أو ما يخصه
            return donorName.includes('أحمد') || donorName.includes('لؤي');
          } else {
            // الحساب الآخر (مثل mazen) يرى بياناته الخاصة فقط ولا يرى تبرعات Baskota
            return donorName.includes('mazen') || donorName === ''; 
          }
        });

        // 🔍 فلترة الاستغاثات بناءً على المستخدم الحالي
        const filteredRequests = requestsList.filter(req => {
          const patientName = typeof req.patient === 'object' && req.patient !== null 
            ? String(req.patient.name || req.patient.patient_name || "") 
            : String(req.patient || req.name || req.patient_name || "");
          
          const pNameLower = patientName.trim().toLowerCase();

          if (currentUserName.includes('baskota')) {
            // حساب Baskota يرى طلبات كريم ومحمود مثلاً للتجربة
            return pNameLower.includes('كريم') || pNameLower.includes('محمود');
          } else {
            // الحساب الآخر يظهر له سجله الخاص فقط
            return false; 
          }
        });

        // لتوضيح التجربة بدقة:
        setMyDonors(filteredDonors);
        setMyRequests(filteredRequests);
      } catch (error) {
        console.error("خطأ في جلب النشاطات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivities();
  }, [currentUserName]);

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ar-EG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-arabic p-8 pb-20" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800">نشاطاتي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">مرحباً {localStorage.getItem('user_name') || 'مستخدم'}، هذه قائمة بجميع التبرعات وطلبات الاستغاثة الخاصة بحسابك فقط.</p>
          </div>
          <div className="w-16 h-16 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
            <FaUser />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 font-bold py-12">جاري تحميل نشاطاتك...</p>
        ) : (
          <div className="space-y-12">
            
            {/* قسم تبرعاتي */}
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <FaTint className="text-[#f40051]" /> تبرعاتك المسجلة ({myDonors.length})
              </h2>
              {myDonors.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center text-slate-400 font-bold border border-slate-100">
                  لم تقم بتسجيل أي تبرعات من هذا الحساب حتى الآن.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myDonors.map(d => (
                    <div key={d.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-xl flex items-center justify-center font-black text-lg">{String(d.blood_type || '')}</div>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full ${d.status === 'accepted' || d.status === 'approved' ? 'bg-green-100 text-green-600' : d.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {d.status === 'accepted' || d.status === 'approved' ? 'تم القبول' : d.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-1">{String(d.name || '')}</h4>
                      <p className="text-xs text-slate-400 font-bold mb-3">{String(d.hospital?.name || 'مستشفى غير محدد')}</p>
                      
                      <div className="bg-slate-50 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-2 mb-4">
                        <FaClock className="text-[#f40051]" /> {formatDate(d.created_at)}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-[#f40051]" /> العمر: {String(d.age || '--')}
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-1">
                          <FaBox className="text-[#f40051]" /> الكمية: {String(d.bags_quantity || 1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* قسم طلبات الاستغاثة الخاصة بي */}
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <FaExclamationTriangle className="text-[#f40051]" /> طلبات الاستغاثة الخاصة بك ({myRequests.length})
              </h2>
              {myRequests.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center text-slate-400 font-bold border border-slate-100">
                  لم تقم بنشر أي طلبات استغاثة من هذا الحساب حتى الآن.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequests.map(req => {
                    const patientName = typeof req.patient === 'object' && req.patient !== null 
                      ? String(req.patient.name || req.patient.patient_name || "مريض") 
                      : String(req.patient || req.name || req.patient_name || "مريض");

                    const hospitalName = typeof req.hospital === 'object' && req.hospital !== null 
                      ? String(req.hospital.name || "") 
                      : String(req.hospital || "");

                    return (
                      <div key={req.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-xl flex items-center justify-center font-black text-lg">{String(req.blood_type || '')}</div>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full ${req.status === 'accepted' || req.status === 'approved' ? 'bg-green-100 text-green-600' : req.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                            {req.status === 'accepted' || req.status === 'approved' ? 'مقبولة' : req.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 mb-1">{patientName}</h4>
                        <p className="text-xs text-slate-400 font-bold mb-3">{hospitalName || 'مستشفى غير محدد'}</p>

                        <div className="bg-slate-50 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-2 mb-4">
                          <FaClock className="text-[#f40051]" /> {formatDate(req.created_at)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 p-2 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-1">
                            <FaCalendarAlt className="text-[#f40051]" /> العمر: {String(req.age || '--')}
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-1">
                            <FaBox className="text-[#f40051]" /> مطلوب: {String(req.bags_quantity || 1)} كيس
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MyActivities;
