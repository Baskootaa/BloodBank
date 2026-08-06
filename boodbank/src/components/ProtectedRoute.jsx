import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowAllUsers = false }) => {
  const isLogged = localStorage.getItem('isLogged') === 'true';
  const userRole = localStorage.getItem('user_role');

  // 1. إذا لم يكن مسجل دخول نهائياً، حوله لصفحة تسجيل الدخول
  if (!isLogged) {
    return <Navigate to="/admin-login" replace />;
  }

  // 2. إذا كانت الصفحة مخصصة للأدمن فقط (وهي الحالة الافتراضية) 
  // والمستخدم الحالي ليس أدمن، حوله للصفحة الرئيسية
  if (!allowAllUsers && userRole !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // 3. إذا كان مسجل دخول (سواء أدمن أو يوزر عادي في الصفحات المسموحة)، اعرض المحتوى
  return children;
};

export default ProtectedRoute;