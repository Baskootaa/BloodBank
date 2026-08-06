import axios from 'axios';

// 1. إنشاء الـ Instance الأساسية
const api = axios.create({
    // استخدام المتغير البيئي إن وجد، أو العودة لرابط السيرفر الحقيقي على Vercel كخيار احتياطي
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://blood-bank-delta-eight.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // مهلة 10 ثوانٍ للطلب
});

// 2. Interceptor للطلبات (إرسال التوكن تلقائياً)
api.interceptors.request.use(
    (config) => {
        // سحب التوكن من الـ localStorage
        const token = localStorage.getItem('token'); 
        
        if (token) {
            // إضافة التوكن في الـ Headers بصيغة Bearer ليفهمه Laravel Sanctum
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor للردود (التعامل مع الأخطاء وإدارة الجلسة)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // إذا رد السيرفر بـ 401 (غير مصرح له / انتهت الجلسة)
        if (error.response && error.response.status === 401) {
            console.warn("تنبيه: الجلسة انتهت أو التوكن غير صالح.");

            const currentPath = window.location.pathname;

            // إذا كان التوكن غير موجود أو تم رفضه وكان المستخدم خارج صفحة الدخول
            if (!currentPath.includes('admin-login') && !currentPath.includes('login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/admin-login';
            }
        }
        return Promise.reject(error);
    }
);

// 4. تصدير النسخة لاستخدامها في باقي المشروع
export default api;
