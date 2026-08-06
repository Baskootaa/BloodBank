import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // دي بتعرف السيستم إن فيه إيرور حصل عشان يغير الحالة (State)
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // هنا بنسجل الإيرور عشان نعرف سببه (ممكن نبعته لسيرفر خارجي مستقبلاً)
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // ده الشكل اللي هيظهر للأدمن لو الكود "فرقع" في أي لحظة
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-10 text-center font-sans" dir="rtl">
          <div className="text-8xl mb-6">🚑</div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">عذراً، حدث خطأ تقني مفاجئ</h1>
          <p className="text-slate-500 font-bold mb-8">
            لا تقلق، بياناتك آمنة. يبدو أن هناك مشكلة بسيطة في عرض هذه الصفحة.
          </p>
          <div className="flex gap-4">
             <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
              >
                العودة للرئيسية
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-[#f40051] text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
              >
                تحديث الصفحة
              </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;