import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowAllUsers = false }) => {
  const isLogged = localStorage.getItem('isLogged') === 'true';
  const userRole = localStorage.getItem('user_role');

  // 1. إذا لم يكن مسجل دخول نهائياً، حوله لصفحة تسجيل الدخول
  if (!isLogged) {
    return <Navigate to="/admin-login" replace />;
  }

  // 2. إذا كانت الصفحة مخصصة للأدمن فقط، نسمح بالدخول لو كان الأدمن أو الموظف، أو لو الـ role مش متسجل بس هو مسجل كأدمن رئيسي
  // (هنا بنسمح لو الـ role هو admin أو employee، أو لو الـ userRole مش موجود أصلاً للتوافق مع الجلسات القديمة)
  if (!allowAllUsers && userRole && userRole !== 'admin' && userRole !== 'employee') {
    return <Navigate to="/home" replace />;
  }

  // 3. إذا كان مسجل دخول ومطابق للشروط، اعرض المحتوى
  return children;
};

export default ProtectedRoute;
