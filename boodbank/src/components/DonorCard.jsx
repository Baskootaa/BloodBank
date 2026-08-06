import { Link } from 'react-router-dom';

const DonorCard = ({ donor, deleteDonor }) => {
  // دالة للتأكد من نظافة الرقم من أي مسافات لضمان عمل الاتصال
  const phoneNumber = donor.phone ? donor.phone.replace(/\s/g, '') : "";

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col items-center">
      
      {/* زر الحذف - يظهر فقط عند تمرير الماوس فوق الكارت (Hover) */}
      <button 
        onClick={() => deleteDonor(donor.id)}
        className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-2 rounded-full bg-gray-50 hover:bg-red-50"
      >
        🗑️
      </button>

      {/* فصيلة الدم */}
      <div className="absolute top-4 left-4 bg-red-50 text-red-600 px-3 py-1 rounded-full font-black text-sm border border-red-100">
        {donor.bloodType}
      </div>

      {/* بيانات المتبرع */}
      <div className="mt-8 mb-6 text-center">
        <h3 className="text-xl font-black text-gray-800 mb-1">{donor.name}</h3>
        <p className="text-gray-400 font-bold flex items-center justify-center gap-1">
          <span>📍</span> {donor.city}
        </p>
        <p className="text-gray-500 mt-2 font-mono tracking-widest">{donor.phone}</p>
      </div>

      {/* الأكشن: زر الاتصال الحقيقي */}
      <a 
        href={`tel:${phoneNumber}`} 
        className="w-full bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100"
      >
        <span className="text-xl">📞</span>
        اتصل الآن
      </a>

      {/* لمسة جمالية: خط جانبي يظهر عند الهوفر */}
      <div className="absolute top-0 right-0 h-full w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default DonorCard;