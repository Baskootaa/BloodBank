import { useState } from 'react';
import DonorCard from '../components/DonorCard';

const Search = ({ donors = [] }) => {
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  // تصفية ذكية: تبحث في الاسم وفي المدينة في نفس الوقت
  const results = donors.filter(donor => {
    // تأمين البيانات لضمان عدم حدوث Error لو القيمة null
    const name = (donor.name || "").toLowerCase();
    
    // التعامل مع المدينة سواء كانت نص مباشر أو Object راجع من الباك إند
    const city = typeof donor.city === 'object' 
      ? (donor.city?.name || "").toLowerCase() 
      : (donor.city || "").toLowerCase();

    const matchesName = name.includes(query.toLowerCase());
    const matchesCity = city.includes(cityFilter.toLowerCase());
    
    return matchesName && matchesCity;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-right" dir="rtl">
      {/* قسم البحث الصاروخي */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 mb-12 -mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <h2 className="text-3xl font-black text-gray-800 mb-8 relative">🔍 ابحث عن منقذ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 mr-2">اسم المتبرع</label>
            <input 
              type="text"
              placeholder="مثلاً: أحمد حسن..."
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 mr-2">المحافظة / المدينة</label>
            <input 
              type="text"
              placeholder="مثلاً: الإسكندرية..."
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* عرض النتائج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.length > 0 ? (
          results.map(donor => (
            <DonorCard key={donor.id} donor={donor} />
          ))
        ) : (
          <div className="col-span-full text-center py-24">
            <div className="text-6xl mb-4">😶</div>
            <h3 className="text-2xl font-bold text-gray-800">لا توجد نتائج!</h3>
            <p className="text-gray-400 mt-2">جرب البحث بكلمات أخرى أو ابحث في مدينة مجاورة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
