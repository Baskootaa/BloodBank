import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; 

// استيراد ملف الـ api الموحد
import api from './api/axios';

// استيراد المكونات
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute'; // استيراد مكون الحماية

// استيراد الصفحات
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BloodRequest from './pages/BloodRequest';
import Register from './pages/Register';
import Contact from './pages/Contact'; 
import SignUp from './pages/SignUp'; 
import AdminLogin from './pages/AdminLogin'; 
import Profile from './pages/Profile'; 

// مكون للتحكم في التمرير لأعلى الصفحة عند تغيير المسار
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// الهيكل الرئيسي - يربط الـ Navbar بحالة البحث العامة
const LayoutWrapper = ({ children, isAuth, setIsAuth, searchTerm, setSearchTerm, notifications }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {isAuth && (
        <Navbar 
          isAuth={isAuth} 
          setIsAuth={setIsAuth} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          notifications={notifications}
        />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {isAuth && <Footer />}
    </div>
  );
};

function App() {
  // حالة تسجيل الدخول مع مزامنتها بـ localStorage
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem('isLogged') === 'true' || localStorage.getItem('isAuth') === 'true';
  });
  
  // حالة البحث المركزية
  const [searchTerm, setSearchTerm] = useState('');

  // حالات البيانات
  const [donors, setDonors] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]); 
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  
  // حالة الإشعارات الخاصة بالـ Navbar
  const [notifications, setNotifications] = useState([]);

  // جلب البيانات من API باستخدام النسخة الموحدة
  const fetchAllData = useCallback(async () => {
    try {
      const [resDonors, resCities, resHospitals, resRequests] = await Promise.all([
        api.get('/donors'),
        api.get('/cities'),
        api.get('/hospitals'),
        api.get('/emergency-requests')
      ]);
      
      const donorsList = Array.isArray(resDonors.data) ? resDonors.data : (resDonors.data.data || []);
      setDonors(donorsList);
      setCities(Array.isArray(resCities.data) ? resCities.data : (resCities.data.data || []));
      
      const hospitalsData = Array.isArray(resHospitals.data) ? resHospitals.data : (resHospitals.data.data || []);
      setHospitals(hospitalsData);
      
      const requestsList = resRequests.data.data || resRequests.data || [];
      setEmergencyRequests(requestsList);
      
      // 1. تصفية الاستغاثات غير المقبولة (pending) لتحويلها لإشعارات
      const pendingRequests = requestsList
        .filter(req => req.status === 'pending')
        .map((req) => ({
          id: req.id,
          title: `استغاثة دم: ${req.blood_type || 'عاجل'}`,
          sub: req.hospital_name || (typeof req.hospital === 'object' ? req.hospital?.name : req.hospital) || 'طلب استغاثة جديد',
          link: `/dashboard?tab=requests&id=${req.id}` // يوجه لتبويب الاستغاثات
        }));

      // 2. تصفية المتبرعين غير المقبولين (pending) لتحويلها لإشعارات
      const pendingDonors = donorsList
        .filter(d => d.status === 'pending')
        .map((donor) => ({
          id: donor.id,
          title: `متبرع جديد: ${donor.blood_type || ''}`,
          sub: donor.name || 'متبرع ينتظر الموافقة',
          link: `/dashboard?tab=donors&id=${donor.id}` // يوجه لتبويب المتبرعين
        }));

      // دمج الإشعارين معاً في قائمة الإشعارات العامة للـ Navbar
      setNotifications([...pendingRequests, ...pendingDonors]);
      
      console.log("Data Sync: OK"); 
    } catch (error) { 
      console.error("خطأ في جلب البيانات:", error); 
    }
  }, []);

  useEffect(() => { 
    if (isAuth) {
      fetchAllData(); 
    }
  }, [fetchAllData, isAuth]);

  // دالة إضافة استغاثة
  const addEmergencyRequest = async (formData) => {
    try {
      await api.post('/emergency-requests', formData);
      Swal.fire({ icon: 'success', title: 'تم نشر الاستغاثة بنجاح', confirmButtonColor: '#f40051' });
      fetchAllData();
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'فشل في حفظ الاستغاثة' }); 
    }
  };

  // دالة تسجيل متبرع
  const addDonor = async (donorData) => {
    try {
      await api.post('/donors', donorData);
      Swal.fire({ icon: 'success', title: 'تم تسجيلك كمتبرع بنجاح', confirmButtonColor: '#f40051' });
      fetchAllData();
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'فشل تسجيل البيانات' }); 
    }
  };

  // دالة تسجيل مستخدم جديد
  const handleUserSignUp = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.status === 201 || response.status === 200) {
        fetchAllData();
        return true; 
      }
    } catch (error) {
      const serverMsg = error.response?.data?.message || error.response?.data?.email?.[0];
      const msg = serverMsg || "فشل إنشاء الحساب، تأكد من صحة البيانات";
      Swal.fire({ icon: 'error', title: 'خطأ في التسجيل', text: msg, confirmButtonColor: '#f40051' });
      return false;
    }
  };

  // دالة حذف متبرع
  const deleteDonor = async (donorId) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن تتمكن من التراجع عن هذا الإجراء!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f40051',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'نعم، احذفه!',
        cancelButtonText: 'إلغاء'
      });
      if (result.isConfirmed) {
        await api.delete(`/donors/${donorId}`);
        fetchAllData(); 
        Swal.fire({ icon: 'success', title: 'تم الحذف بنجاح', timer: 1500, showConfirmButton: false });
      }
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'حدث خطأ أثناء الحذف' }); 
    }
  };

  // تحديث حالة التخزين المحلي عند تغير حالة الاعتماد
  useEffect(() => { 
    localStorage.setItem('isLogged', isAuth ? 'true' : 'false');
    localStorage.setItem('isAuth', isAuth ? 'true' : 'false');
  }, [isAuth]);

  return (
    <Router>
      <ScrollToTop />
      
      <LayoutWrapper 
        isAuth={isAuth} 
        setIsAuth={setIsAuth} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        notifications={notifications}
      >
        <Routes>
          <Route path="/" element={
            isAuth ? <Home donors={donors} hospitals={hospitals} bloodRequests={emergencyRequests} searchTerm={searchTerm} deleteDonor={deleteDonor} isAuth={isAuth} /> : <Navigate to="/admin-login" replace />
          } />
          
          <Route path="/home" element={
            isAuth ? <Home donors={donors} hospitals={hospitals} bloodRequests={emergencyRequests} searchTerm={searchTerm} deleteDonor={deleteDonor} isAuth={isAuth} /> : <Navigate to="/admin-login" replace />
          } />
          <Route path="/blood-request" element={
            isAuth ? <BloodRequest requests={emergencyRequests} addRequest={addEmergencyRequest} /> : <Navigate to="/admin-login" replace />
          } />
          <Route path="/register" element={
            isAuth ? <Register addDonor={addDonor} cities={cities} /> : <Navigate to="/admin-login" replace />
          } />
          <Route path="/contact" element={
            isAuth ? <Contact /> : <Navigate to="/admin-login" replace />
          } />
          <Route path="/signup" element={<SignUp handleSignUp={handleUserSignUp} />} />
          <Route path="/admin-login" element={<AdminLogin setIsAuth={setIsAuth} isAuth={isAuth} />} />
          
          {/* لوحة التحكم */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard 
                donors={donors} 
                hospitals={hospitals} 
                cities={cities} 
                emergencyRequests={emergencyRequests} 
                deleteDonor={deleteDonor} 
                refreshData={fetchAllData} 
              />
            </ProtectedRoute>
          } />

          {/* الإعدادات والبروفايل */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to={isAuth ? "/home" : "/admin-login"} replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
