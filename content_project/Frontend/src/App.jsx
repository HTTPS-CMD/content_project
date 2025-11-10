// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import MainLayout from './components/MainLayout';
import ProjectDetailPage from './components/ProjectDetailPage'; // <-- جدید

/**
 * کامپوننت برای محافظت از روت‌ها
 * چک می‌کند آیا کاربر توکن دارد یا خیر
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // اگر توکن نبود، کاربر را به صفحه لاگین هدایت کن
    return <Navigate to="/login" replace />;
  }

  // اگر توکن بود، صفحه‌ای که می‌خواست را در چیدمان اصلی نشان بده
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

// تابع App اصلی
function App() {
  return (
    <div className="App">
      <Routes>
        {/* روت لاگIN: حالا ساده شده و دیگر LoginWrapper ندارد */}
        <Route
          path="/login"
          element={<LoginPage />}
        />
          <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />

        {/* روت داشبورد (محافظت شده) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* روت اصلی (/) کاربر را به داشبورد یا لاگین هدایت می‌کند */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;