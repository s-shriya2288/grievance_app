import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_ROLES = ['Department Admin', 'Super Admin']

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
