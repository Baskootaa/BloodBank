import React from 'react'

const About = () => {
  const stats = [
    { label: "متبرع مسجل", value: "+500", icon: "👥" },
    { label: "حالة تم إنقاذها", value: "+1200", icon: "❤️" },
    { label: "محافظة مغطاة", value: "27", icon: "📍" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 text-center mt-10">
      <h2 className="text-4xl font-black text-gray-800 mb-6">عن منصة <span className="text-red-600">نبض الحياة</span></h2>
      <p className="text-xl text-gray-600 leading-relaxed mb-12">
        نحن منصة غير ربحية تهدف إلى تسهيل عملية الوصول للمتبرعين بالدم في أسرع وقت ممكن. 
        نؤمن أن التكنولوجيا يمكن أن تساهم في إنقاذ الأرواح من خلال ربط المتبرع بالمحتاج بضغطة زر.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-transform hover:scale-105">
            <div className="text-4xl mb-4">{stat.icon}</div>
            <div className="text-3xl font-black text-red-600 mb-2">{stat.value}</div>
            <div className="text-gray-500 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About
