import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import { ApiError } from '../api/client'
import type { UserProfile } from '../types/api'

interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<UserProfile>
  register: (input: authApi.RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (input: Parameters<typeof authApi.updateProfile>[0]) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authApi
      .fetchMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (identifier: string, password: string, rememberMe = true) => {
    const { user } = await authApi.login(identifier, password, rememberMe)
    setUser(user)
    return user
  }

  const register = async (input: authApi.RegisterInput) => {
    await authApi.register(input)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  const refreshProfile = async () => {
    const { user } = await authApi.fetchMe()
    setUser(user)
  }

  const updateProfile = async (input: Parameters<typeof authApi.updateProfile>[0]) => {
    const { user } = await authApi.updateProfile(input)
    setUser(user)
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await authApi.changePassword(currentPassword, newPassword)
  }

  if (isLoading) return null

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ApiError }
