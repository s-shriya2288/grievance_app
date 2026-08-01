import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { GrievanceProvider } from './context/GrievanceContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import GrievancesListPage from './pages/GrievancesListPage'
import GrievanceDetailPage from './pages/GrievanceDetailPage'
import NewGrievancePage from './pages/NewGrievancePage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AuditLogPage from './pages/AuditLogPage'
import AdminUsersPage from './pages/AdminUsersPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GrievanceProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/grievances" element={<GrievancesListPage />} />
                <Route path="/grievances/new" element={<NewGrievancePage />} />
                <Route path="/grievances/:id" element={<GrievanceDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/profile" element={<ProfilePage />} />
                <Route path="/admin/audit-logs" element={<AuditLogPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </GrievanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
