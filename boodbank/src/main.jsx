import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 
// 1. استدعاء الملف اللي إنت لسه أنشأته
import ErrorBoundary from './components/ErrorBoundary' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. تغليف التطبيق بالكامل داخل حارس الأخطاء */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)