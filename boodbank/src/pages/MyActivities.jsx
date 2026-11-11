import React, { useState, useEffect } from 'react';
import { FaUser, FaTint, FaExclamationTriangle, FaCalendarAlt, FaBox, FaPhoneAlt } from 'react-icons/fa';
import api from '../api/axios';

const MyActivities = () => {
  const [myDonors, setMyDonors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem('user_name') || '';
  const userEmail = localStorage.getItem('user_email') || '';

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const [resDonors, resRequests] = await Promise.all([
          api.get('/donors'),
          api.get('/emergency-requests')
        ]);

        const donorsList = Array.isArray(resDonors.data) ? resDonors.data : (resDonors.data?.data || []);
        const requestsList = Array.isArray(resRequests.data) ? resRequests.data : (resRequests.data?.data || []);

        // تصفية المتبرعين والطلبات بأمان
        const filteredDonors = donorsList.filter(d => {
          if (!d) return false;
          const dName = String(d.name || '').toLowerCase();
          const dEmail = String(d.email || '').toLowerCase();
          return (userName && dName === userName.toLowerCase()) || (userEmail && dEmail === userEmail.toLowerCase());
        });

        const filteredRequests = requestsList.filter(r => {
          if (!r) return false;
          const pName = typeof r.patient === 'object' && r.patient !== null 
            ? String(r.patient.name || r.patient.patient_name || '') 
            : String(r.patient || r.name || r.patient_name || '');
          const rEmail = String(r.email || '').toLowerCase();
          return (userName && pName.toLowerCase() === userName.toLowerCase()) || (userEmail && rEmail === userEmail.toLowerCase());
        });

        setMyDonors(filteredDonors);
        setMyRequests(filteredRequests);
      } catch (error) {
        console.error("خطأ في جلب النشاطات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivities();
  }, [userName, userEmail]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-arabic p-8 pb-20" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800">نشاطاتي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">مرحباً {userName || 'مستخدم'}, هذه قائمة بجميع تبرعاتك وطلبات الاستغاثة الخاصة بك.</p>
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
                  لم تقم بتسجيل أي تبرعات حتى الآن.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myDonors.map(d => (
                    <div key={d.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-xl flex items-center justify-center font-black text-lg">{String(d.blood_type || '')}</div>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full ${d.status === 'accepted' ? 'bg-green-100 text-green-600' : d.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {d.status === 'accepted' ? 'مقبول' : d.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-1">{String(d.name || '')}</h4>
                      <p className="text-xs text-slate-400 font-bold mb-4">{String(d.hospital?.name || 'مستشفى غير محدد')}</p>
                      <div className="text-[10px] text-slate-400 font-bold bg-slate-50 p-2 rounded-xl">
                        تاريخ التبرع: {d.created_at ? new Date(d.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
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
                  لم تقم بنشر أي طلبات استغاثة حتى الآن.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-red-50 text-[#f40051] rounded-xl flex items-center justify-center font-black text-lg">{String(req.blood_type || '')}</div>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full ${req.status === 'accepted' ? 'bg-green-100 text-green-600' : req.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {req.status === 'accepted' ? 'مقبولة' : req.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-1">طلب دم عاجل</h4>
                      <p className="text-xs text-slate-400 font-bold mb-4">{String(req.hospital?.name || 'مستشفى غير محدد')}</p>
                      <div className="text-[10px] text-slate-400 font-bold bg-slate-50 p-2 rounded-xl">
                        تاريخ الطلب: {req.created_at ? new Date(req.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                      </div>
                    </div>
                  ))}
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
