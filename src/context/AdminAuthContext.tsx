import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const SESSION_KEY = 'grievance-portal:admin-session'

export interface AdminProfile {
  name: string
  email: string
  role: string
  unitLocation: string
}

const demoAdmin: Omit<AdminProfile, 'email'> = {
  name: 'Anjali Mohanty',
  role: 'HR Business Partner',
  unitLocation: 'Rajgangpur Unit',
}

interface AdminAuthContextValue {
  admin: AdminProfile | null
  isAdminAuthenticated: boolean
  loginAdmin: (email: string, password: string) => Promise<void>
  logoutAdmin: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        setAdmin(JSON.parse(stored))
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setHydrated(true)
  }, [])

  const loginAdmin = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error('Enter both email and password.')
    }
    const profile: AdminProfile = { ...demoAdmin, email: email.trim() }
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
    setAdmin(profile)
  }

  const logoutAdmin = () => {
    localStorage.removeItem(SESSION_KEY)
    setAdmin(null)
  }

  if (!hydrated) return null

  return (
    <AdminAuthContext.Provider value={{ admin, isAdminAuthenticated: !!admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
