import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { listAdminUsers, listAuditLogs, type AuditLogEntry } from '../api/admin'
import { fetchDepartments } from '../api/reference'
import { useAuth } from './AuthContext'
import type { DepartmentOption, UserProfile } from '../types/api'

interface AdminDataContextValue {
  admins: UserProfile[]
  departments: DepartmentOption[]
  auditLogs: AuditLogEntry[]
  isLoading: boolean
  error: string | null
  addAdmin: (user: UserProfile) => void
}

const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [admins, setAdmins] = useState<UserProfile[]>([])
  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchedForUserId = useRef<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'Super Admin') {
      setIsLoading(false)
      return
    }
    if (fetchedForUserId.current === user.id) return
    fetchedForUserId.current = user.id

    setIsLoading(true)
    Promise.all([listAdminUsers(), fetchDepartments(), listAuditLogs()])
      .then(([adminsRes, deptRes, logsRes]) => {
        setAdmins(adminsRes.admins)
        setDepartments(deptRes.departments)
        setAuditLogs(logsRes.logs)
      })
      .catch((err) => {
        fetchedForUserId.current = null
        setError(err instanceof Error ? err.message : 'Failed to load admin data.')
      })
      .finally(() => setIsLoading(false))
  }, [user])

  const addAdmin = useCallback((newAdmin: UserProfile) => {
    setAdmins((prev) => [...prev, newAdmin])
  }, [])

  return (
    <AdminDataContext.Provider value={{ admins, departments, auditLogs, isLoading, error, addAdmin }}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
