import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { GrievanceProvider } from './context/GrievanceContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GrievancesListPage from './pages/GrievancesListPage'
import GrievanceDetailPage from './pages/GrievanceDetailPage'
import NewGrievancePage from './pages/NewGrievancePage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GrievanceProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </GrievanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
