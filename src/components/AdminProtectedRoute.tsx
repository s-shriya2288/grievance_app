import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdminAuthenticated } = useAdminAuth()
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
