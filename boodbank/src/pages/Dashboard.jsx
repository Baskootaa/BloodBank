import { useState, useMemo } from 'react';
import { 
  FaUsers, FaTint, FaHospital, FaExclamationTriangle, 
  FaTrash, FaSearch, FaBell, FaCalendarAlt, FaBox, 
  FaMapMarkerAlt, FaPhoneAlt, FaChevronRight, FaSyncAlt,
  FaCheck, FaTimes, FaCity, FaPlus
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api/axios'; // ✅ استخدام محرك Axios الموحد

const Dashboard = ({ 
  donors = [], 
  hospitals = [], 
  emergencyRequests = [], 
  cities = [], 
  deleteDonor, 
  refreshData 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // حساب إجمالي المخزون الكلي
  const totalBagsAllHospitals = useMemo(() => {
    return hospitals.reduce((total, h) => {
        const hospitalSum = h.blood_stocks?.reduce((sum, s) => sum + (Number(s.bags_quantity) || 0), 0) || 0;
        return total + hospitalSum;
    }, 0);
  }, [hospitals]);

  // الإشعارات (متبرعين + استغاثات)
  const pendingDonors = donors.filter(d => d.status === 'pending');
  const pendingRequests = emergencyRequests.filter(req => req.status === 'pending');
  
  const allNotifications = [
    ...pendingRequests.map(r => ({ 
      id: r.id, 
      type: 'request', 
      title: `استغاثة جديدة: ${r.blood_type}`, 
      sub: r.name || r.patient_name || "مريض" 
    })),
    ...pendingDonors.map(d => ({ 
      id: d.id, 
      type: 'donor', 
      title: `متبرع جديد: ${d.name}`, 
      sub: `فصيلة ${d.blood_type}` 
    }))
  ];

  // --- منطق البحث الموحد ---
  const lowerQuery = searchQuery.toLowerCase().trim();

  const filteredDonors = donors.filter(d => 
    d.name?.toLowerCase().includes(lowerQuery) || 
    d.blood_type?.toLowerCase().includes(lowerQuery) ||
    d.hospital?.name?.toLowerCase().includes(lowerQuery)
  );

  const filteredRequests = emergencyRequests.filter(r => 
    (r.name || r.patient_name)?.toLowerCase().includes(lowerQuery) || 
    r.hospital?.name?.toLowerCase().includes(lowerQuery) ||
    r.blood_type?.toLowerCase().includes(lowerQuery)
  );

  const filteredHospitals = hospitals.filter(h => 
    h.name?.toLowerCase().includes(lowerQuery) || 
    h.city?.name?.toLowerCase().includes(lowerQuery) || 
    h.address?.toLowerCase().includes(lowerQuery)
  );

  const filteredCities = cities.filter(c => 
    c.name?.toLowerCase().includes(lowerQuery)
  );

  // دالة تحديث حالة المتبرع
  const handleDonorStatus = async (id, status) => {
    try {
      await api.post(`/donors/${id}/update-status`, { status });
      refreshData(); 
      Swal.fire({ title: status === 'accepted' ? 'تم قبول المتبرع' : 'تم الرفض', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (e) { Swal.fire('خطأ', 'فشل تحديث حالة المتبرع', 'error'); }
  };

  // دالة تحديث حالة الاستغاثة
  const handleRequestStatus = async (id, status) => {
    try {
      await api.post(`/emergency-requests/${id}/update-status`, { status });
      refreshData(); 
      Swal.fire({ title: status === 'accepted' ? 'تم قبول الاستغاثة' : 'تم الرفض', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (e) { Swal.fire('خطأ', 'فشل تحديث حالة الاستغاثة', 'error'); }
  };

  const handleUpdateStock = async (hospitalId) => {
    const { value: formValues } = await Swal.fire({
      title: 'تحديث المخزون',
      html:
        '<select id="swal-blood-type" class="swal2-input">' +
        ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => `<option value="${t}">${t}</option>`).join('') +
        '</select>' +
        '<input id="swal-bags" type="number" placeholder="عدد الأكياس الجديد" class="swal2-input">',
      confirmButtonText: 'تحديث',
      confirmButtonColor: '#f40051',
      preConfirm: () => ({
        blood_type: document.getElementById('swal-blood-type').value,
        bags_quantity: document.getElementById('swal-bags').value // ✅ تم التعديل لتتوافق مع الـ Backend
      })
    });
    if (formValues) {
      try {
        await api.post(`/hospitals/${hospitalId}/update-stock`, formValues);
        refreshData(); 
        Swal.fire('تم التحديث', 'تم تعديل المخزون بنجاح', 'success');
      } catch (e) { Swal.fire('خطأ', 'فشل تحديث البيانات', 'error'); }
    }
  };

  // دالة إضافة مستشفى جديد
  const handleAddHospital = async () => {
    const citiesOptions = cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const { value: formValues } = await Swal.fire({
      title: 'إضافة مستشفى جديد',
      html:
        '<input id="swal-hospital-name" type="text" placeholder="اسم المستشفى" class="swal2-input">' +
        '<input id="swal-hospital-address" type="text" placeholder="العنوان" class="swal2-input">' +
        `<select id="swal-hospital-city" class="swal2-input"><option value="">اختر المدينة</option>${citiesOptions}</select>`,
      confirmButtonText: 'إضافة',
      confirmButtonColor: '#f40051',
      preConfirm: () => {
        const name = document.getElementById('swal-hospital-name').value;
        const address = document.getElementById('swal-hospital-address').value;
        const city_id = document.getElementById('swal-hospital-city').value;
        if (!name || !address || !city_id) {
          Swal.showValidationMessage('الرجاء إدخال كافة البيانات');
        }
        return { name, address, city_id };
      }
    });

    if (formValues) {
      try {
        await api.post('/hospitals', formValues);
        refreshData();
        Swal.fire('تم بنجاح', 'تم إضافة المستشفى بنجاح', 'success');
      } catch (e) {
        Swal.fire('خطأ', 'فشل إضافة المستشفى', 'error');
      }
    }
  };

  // دالة إضافة مدينة جديدة
  const handleAddCity = async () => {
    const { value: cityName } = await Swal.fire({
      title: 'إضافة مدينة جديدة',
      input: 'text',
      inputPlaceholder: 'اسم المدينة',
      confirmButtonText: 'إضافة',
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
        if (!value) {
          return 'الرجاء إدخال اسم المدينة!';
        }
      }
    });

    if (cityName) {
      try {
        await api.post('/cities', { name: cityName });
        refreshData();
        Swal.fire('تم بنجاح', 'تم إضافة المدينة بنجاح', 'success');
      } catch (e) {
        Swal.fire('خطأ', 'فشل إضافة المدينة', 'error');
      }
    }
  };

  const deleteRequest = async (id) => {
    const result = await Swal.fire({ title: 'حذف الاستغاثة؟', icon: 'warning', showCancelButton: true, confirmButtonColor: '#f40051', confirmButtonText: 'حذف' });
    if (result.isConfirmed) {
      try {
        await api.delete(`/emergency-requests/${id}`);
        refreshData();
      } catch (e) { Swal.fire('خطأ', 'فشل الحذف', 'error'); }
    }
  };

  return (
    <div className="flex bg-[#f8fafc] font-arabic min-h-screen overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white flex flex-col shadow-2xl z-20 border-l border-slate-100">
        <div className="p-8 text-center border-b border-slate-50">
          <h2 className="text-2xl font-black text-[#f40051] italic tracking-tighter">BASKOTA</h2>
        </div>
        <nav className="p-6 space-y-3 flex-grow">
          {[
            { id: 'overview', name: 'الرئيسية', icon: <BoxIcon /> },
            { id: 'donors', name: 'المتبرعين', icon: <FaUsers /> },
            { id: 'requests', name: 'الاستغاثات', icon: <FaExclamationTriangle /> },
            { id: 'hospitals', name: 'المستشفيات', icon: <FaHospital /> },
            { id: 'cities', name: 'المدن', icon: <FaCity /> },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === item.id ? 'bg-[#f40051] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              <span className="text-lg">{item.icon}</span> {item.name}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t">
          <div className="bg-slate-900 rounded-3xl p-6 text-white text-center relative overflow-hidden group">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Total Inventory</p>
            <h4 className="text-3xl font-black">{totalBagsAllHospitals.toLocaleString()}</h4>
            <FaTint className="absolute -right-4 -bottom-4 text-white/10 text-6xl" />
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 border-b border-slate-100 sticky top-0 z-30">
            <div className="relative w-96">
               <input type="text" placeholder="ابحث عن متبرع، مستشفى، أو استغاثة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full py-3 pr-12 pl-4 bg-slate-100 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-red-100 transition-all"/>
               <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
               <button onClick={() => setShowNotifications(!showNotifications)} className="p-3.5 bg-slate-100 text-slate-500 rounded-2xl relative hover:text-[#f40051] transition-all shadow-sm">
                 <FaBell />
                 {allNotifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-[#f40051] rounded-full border-2 border-white animate-pulse"></span>}
               </button>
               {showNotifications && (
                 <div className="absolute top-full left-0 mt-4 w-80 bg-white shadow-2xl rounded-3xl border border-slate-100 z-50 py-4">
                   <div className="px-5 pb-3 border-b font-black text-xs text-slate-400 uppercase flex justify-between">
                     <span>الإشعارات</span>
                     <span className="bg-red-100 text-[#f40051] px-2 rounded-full">{allNotifications.length}</span>
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                     {allNotifications.map((notif, idx) => (
                       <div key={`${notif.type}-${idx}`} className="p-4 hover:bg-slate-50 cursor-pointer border-b last:border-0" onClick={() => {setActiveTab(notif.type === 'request' ? 'requests' : 'donors'); setShowNotifications(false);}}>
                         <p className="text-[11px] font-black text-slate-800">{notif.title}</p>
                         <p className="text-[10px] text-slate-400 font-bold">{notif.sub}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
        </header>

        <main className="p-8 pb-20">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="المتبرعين المطابقين" value={filteredDonors.length} bgColor="bg-blue-600" icon={<FaUsers />} onClick={() => setActiveTab('donors')} />
              <StatCard title="المستشفيات المطابقة" value={filteredHospitals.length} bgColor="bg-[#f40051]" icon={<FaHospital />} onClick={() => setActiveTab('hospitals')} />
              <StatCard title="الاستغاثات المطابقة" value={filteredRequests.length} bgColor="bg-slate-900" icon={<FaExclamationTriangle />} onClick={() => setActiveTab('requests')} />
              <StatCard title="المدن المسجلة" value={filteredCities.length} bgColor="bg-emerald-600" icon={<FaCity />} onClick={() => setActiveTab('cities')} />
            </div>
          )}

          {/* المتبرعون */}
          {activeTab === 'donors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5">
              {filteredDonors.map(d => (
                <div key={d.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden group">
                  {d.status === 'pending' && <div className="absolute top-0 left-0 bg-yellow-400 text-[8px] font-black px-4 py-1 rounded-br-xl uppercase tracking-tighter text-white">New Donor</div>}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-red-50 text-[#f40051] rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">{d.blood_type}</div>
                    <button onClick={() => deleteDonor(d.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FaTrash size={14} /></button>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-1">{d.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mb-6">{d.hospital?.name || 'غير محدد'}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl text-[11px] font-black text-slate-500 flex items-center gap-2"><FaCalendarAlt className="text-[#f40051]"/> العمر: {d.age}</div>
                    <div className="bg-slate-50 p-3 rounded-2xl text-[11px] font-black text-slate-500 flex items-center gap-2"><FaBox className="text-[#f40051]"/> الكمية: {d.bags_quantity || 1}</div>
                  </div>
                  {d.status === 'pending' ? (
                    <div className="flex gap-2">
                       <button onClick={() => handleDonorStatus(d.id, 'accepted')} className="flex-grow flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl font-black text-[10px] hover:bg-green-600 transition-all shadow-md"><FaCheck /> موافقة</button>
                       <button onClick={() => handleDonorStatus(d.id, 'rejected')} className="px-5 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] hover:bg-red-500 hover:text-white transition-all"><FaTimes /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                       <a href={`tel:${d.phone}`} className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-50 text-green-600 rounded-2xl font-black text-xs hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm"><FaPhoneAlt size={12} /> {d.phone}</a>
                       <span className={`text-[9px] font-black px-3 py-1 rounded-full ${d.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{d.status === 'accepted' ? 'تم القبول' : 'مرفوض'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* الاستغاثات */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right">
              {filteredRequests.map(req => (
                <div key={req.id} className="bg-white p-7 rounded-[3rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                  {req.status === 'pending' && <div className="absolute top-0 left-0 bg-[#f40051] text-[8px] font-black px-4 py-1 rounded-br-xl uppercase tracking-tighter text-white animate-pulse">Urgent Request</div>}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 bg-red-50 text-[#f40051] rounded-[1.5rem] flex items-center justify-center font-black text-2xl">{req.blood_type}</div>
                    <button onClick={() => deleteRequest(req.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"><FaTrash size={14} /></button>
                  </div>
                  <h4 className="text-xl font-black text-slate-800">{req.name || req.patient_name || "مريض غير معروف"}</h4>
                  <p className="text-xs text-slate-400 font-bold mb-6">{req.hospital?.name}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl text-[11px] font-black text-slate-500 flex items-center gap-2"><FaCalendarAlt className="text-[#f40051]"/> العمر: {req.age || '--'}</div>
                    <div className="bg-slate-50 p-3 rounded-2xl text-[11px] font-black text-slate-500 flex items-center gap-2"><FaBox className="text-[#f40051]"/> مطلوب {req.bags_quantity} أكياس</div>
                  </div>
                  {req.status === 'pending' ? (
                    <div className="flex gap-2">
                       <button onClick={() => handleRequestStatus(req.id, 'accepted')} className="flex-grow flex items-center justify-center gap-2 py-3 bg-[#f40051] text-white rounded-2xl font-black text-[10px] hover:bg-red-600 transition-all shadow-md shadow-red-100"><FaCheck /> قبول الاستغاثة</button>
                       <button onClick={() => handleRequestStatus(req.id, 'rejected')} className="px-5 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] hover:bg-red-500 hover:text-white transition-all"><FaTimes /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                       <a href={`tel:${req.phone}`} className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-50 text-green-600 rounded-2xl font-black text-xs hover:bg-green-600 hover:text-white transition-all shadow-sm"><FaPhoneAlt size={12} /> {req.phone}</a>
                       <span className={`text-[9px] font-black px-3 py-1 rounded-full ${req.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{req.status === 'accepted' ? 'مقبولة' : 'مرفوضة'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* المستشفيات */}
          {activeTab === 'hospitals' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800">قائمة المستشفيات</h3>
                <button 
                  onClick={handleAddHospital}
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#f40051] text-white rounded-2xl font-black text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                >
                  <FaPlus /> إضافة مستشفى جديد
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredHospitals.map(h => {
                  const getQty = (type) => {
                    const stock = h.blood_stocks?.find(s => s.blood_type === type);
                    return stock ? stock.bags_quantity : 0;
                  };
                  const hospitalTotal = h.blood_stocks?.reduce((sum, s) => sum + (Number(s.bags_quantity) || 0), 0) || 0;
                  return (
                    <div key={h.id} className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-[#f40051] text-white rounded-[2rem] flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform"><span className="text-[10px] font-black opacity-70">TOTAL</span><span className="text-3xl font-black">{hospitalTotal}</span></div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-800">{h.name}</h3>
                          <p className="text-slate-400 text-[10px] font-black mt-1 flex items-center gap-2"><FaMapMarkerAlt className="text-[#f40051]"/> {h.city?.name} - {h.address}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                          <div key={type} className="bg-slate-50 p-3 rounded-2xl text-center border border-transparent hover:border-red-100 hover:bg-red-50 transition-all group/item">
                            <p className="text-[9px] font-black text-slate-400 group-hover/item:text-[#f40051] uppercase">{type}</p>
                            <p className="text-lg font-black text-slate-800">{getQty(type)}</p>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleUpdateStock(h.id)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs hover:bg-[#f40051] transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-100"><FaSyncAlt /> تحديث مخزون المستشفى</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* المدن */}
          {activeTab === 'cities' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800">قائمة المدن</h3>
                <button 
                  onClick={handleAddCity}
                  className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  <FaPlus /> إضافة مدينة جديدة
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map(c => (
                  <div key={c.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
                      <FaCity />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800">{c.name}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">المستشفيات التابعة: {c.hospitals_count || c.hospitals?.length || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, bgColor, icon, onClick }) => (
  <button onClick={onClick} className={`${bgColor} w-full p-8 rounded-[3rem] text-right text-white shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
    <div className="absolute -right-6 -bottom-6 opacity-10 text-9xl group-hover:scale-125 transition-transform duration-700">{icon}</div>
    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md text-2xl">{icon}</div>
    <p className="text-white/60 font-black text-xs uppercase tracking-widest">{title}</p>
    <h3 className="text-4xl font-black mt-2 mb-4 tracking-tighter">{value}</h3>
    <div className="flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-4 py-2 rounded-full">عرض التفاصيل <FaChevronRight size={8} /></div>
  </button>
);

const BoxIcon = () => <FaBox />;

export default Dashboard;
