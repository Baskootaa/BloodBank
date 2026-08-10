import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import axios from 'axios'; 
import 'sweetalert2/dist/sweetalert2.min.css'; 

// استيراد المكونات
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute'; // استيراد مكون الحماية الجديد

// استيراد الصفحات
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BloodRequest from './pages/BloodRequest';
import Register from './pages/Register';
import Contact from './pages/Contact'; 
import SignUp from './pages/SignUp'; 
import AdminLogin from './pages/AdminLogin'; 
import Profile from './pages/Profile'; 

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://blood-bank-delta-eight.vercel.app/api';

// مكون للتحكم في التمرير لأعلى الصفحة عند تغيير المسار
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// الهيكل الرئيسي - يربط الـ Navbar بحالة البحث العامة
const LayoutWrapper = ({ children, isAuth, setIsAuth, searchTerm, setSearchTerm }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar 
        isAuth={isAuth} 
        setIsAuth={setIsAuth} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  // حالة تسجيل الدخول
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('isLogged') === 'true');
  
  // حالة البحث المركزية (تربط الـ Navbar بجميع الصفحات)
  const [searchTerm, setSearchTerm] = useState('');

  // حالات البيانات
  const [donors, setDonors] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]); 
  const [emergencyRequests, setEmergencyRequests] = useState([]);

  // جلب البيانات من API
  const fetchAllData = useCallback(async () => {
    try {
      const [resDonors, resCities, resHospitals, resRequests] = await Promise.all([
        axios.get(`${API_URL}/donors`),
        axios.get(`${API_URL}/cities`),
        axios.get(`${API_URL}/hospitals`),
        axios.get(`${API_URL}/emergency-requests`)
      ]);
      
      setDonors(Array.isArray(resDonors.data) ? resDonors.data : (resDonors.data.data || []));
      setCities(Array.isArray(resCities.data) ? resCities.data : (resCities.data.data || []));
      
      const hospitalsData = Array.isArray(resHospitals.data) ? resHospitals.data : (resHospitals.data.data || []);
      setHospitals(hospitalsData);
      
      setEmergencyRequests(resRequests.data.data || resRequests.data || []);
      
      console.log("Data Sync: OK"); 
    } catch (error) { 
      console.error("خطأ في جلب البيانات:", error); 
    }
  }, []);

  useEffect(() => { 
    fetchAllData(); 
  }, [fetchAllData]);

  // دالة إضافة استغاثة
  const addEmergencyRequest = async (formData) => {
    try {
      await axios.post(`${API_URL}/emergency-requests`, formData);
      Swal.fire({ icon: 'success', title: 'تم نشر الاستغاثة بنجاح', confirmButtonColor: '#f40051' });
      fetchAllData();
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'فشل في حفظ الاستغاثة' }); 
    }
  };

  // دالة تسجيل متبرع
  const addDonor = async (donorData) => {
    try {
      await axios.post(`${API_URL}/donors`, donorData);
      Swal.fire({ icon: 'success', title: 'تم تسجيلك كمتبرع بنجاح', confirmButtonColor: '#f40051' });
      fetchAllData();
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'فشل تسجيل البيانات' }); 
    }
  };

  // دالة تسجيل مستخدم جديد
  const handleUserSignUp = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
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
        await axios.delete(`${API_URL}/donors/${donorId}`);
        fetchAllData(); 
        Swal.fire({ icon: 'success', title: 'تم الحذف بنجاح', timer: 1500, showConfirmButton: false });
      }
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'حدث خطأ أثناء الحذف' }); 
    }
  };

  useEffect(() => { 
    localStorage.setItem('isLogged', isAuth ? 'true' : 'false'); 
  }, [isAuth]);

  return (
    <Router>
      <ScrollToTop />
      
      <LayoutWrapper 
        isAuth={isAuth} 
        setIsAuth={setIsAuth} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
      >
        <Routes>
          <Route path="/" element={
            <Home donors={donors} hospitals={hospitals} bloodRequests={emergencyRequests} searchTerm={searchTerm} deleteDonor={deleteDonor} isAuth={isAuth} />
          } />
          
          <Route path="/home" element={
            <Home donors={donors} hospitals={hospitals} bloodRequests={emergencyRequests} searchTerm={searchTerm} deleteDonor={deleteDonor} isAuth={isAuth} />
          } />
         <Route path="/blood-request" element={<BloodRequest requests={emergencyRequests} addRequest={addEmergencyRequest} />} />
          <Route path="/register" element={<Register addDonor={addDonor} cities={cities} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp handleSignUp={handleUserSignUp} />} />
          <Route path="/admin-login" element={<AdminLogin setIsAuth={setIsAuth} isAuth={isAuth} />} />
          
          {/* لوحة التحكم: للأدمن فقط (لذلك نتركها كما هي) */}
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

          {/* الإعدادات: يجب إضافة allowAllUsers={true} ليفتح لغير الأدمن */}
          <Route path="/settings" element={
            <ProtectedRoute allowAllUsers={true}>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;