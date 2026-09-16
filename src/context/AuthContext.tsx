import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import { ApiError } from '../api/client'
import type { UserProfile } from '../types/api'

interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<UserProfile>
  register: (input: authApi.RegisterInput) => Promise<{ email: string; devOtp?: string }>
  verifyEmail: (email: string, otp: string) => Promise<void>
  resendVerification: (email: string) => Promise<{ devOtp?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (input: Parameters<typeof authApi.updateProfile>[0]) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  requestEmailChange: (newEmail: string) => Promise<{ devOtp?: string }>
  confirmEmailChange: (otp: string) => Promise<void>
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
    return authApi.register(input)
  }

  const verifyEmail = async (email: string, otp: string) => {
    await authApi.verifyEmail(email, otp)
  }

  const resendVerification = async (email: string) => {
    return authApi.resendVerification(email)
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

  const requestEmailChange = async (newEmail: string) => {
    return authApi.requestEmailChange(newEmail)
  }

  const confirmEmailChange = async (otp: string) => {
    const { user } = await authApi.confirmEmailChange(otp)
    setUser(user)
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
        verifyEmail,
        resendVerification,
        logout,
        refreshProfile,
        updateProfile,
        changePassword,
        requestEmailChange,
        confirmEmailChange,
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
