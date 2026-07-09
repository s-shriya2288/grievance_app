import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { demoEmployee } from '../data/mockData'
import type { Employee } from '../types'

const SESSION_KEY = 'grievance-portal:session'

interface AuthContextValue {
  employee: Employee | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        setEmployee(JSON.parse(stored))
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setHydrated(true)
  }, [])

  const login = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error('Enter both email and password.')
    }
    const loggedInEmployee: Employee = {
      ...demoEmployee,
      email: email.trim(),
      name: demoEmployee.name,
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInEmployee))
    setEmployee(loggedInEmployee)
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setEmployee(null)
  }

  if (!hydrated) return null

  return (
    <AuthContext.Provider value={{ employee, isAuthenticated: !!employee, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
