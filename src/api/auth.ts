import { api } from './client'
import type { UserProfile } from '../types/api'

export interface RegisterInput {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  departmentId: string
  password: string
  confirmPassword: string
}

export function register(input: RegisterInput) {
  return api.post<{ user: UserProfile }>('/api/auth/register', input)
}

export function login(identifier: string, password: string, rememberMe = true) {
  return api.post<{ user: UserProfile }>('/api/auth/login', { identifier, password, rememberMe })
}

export function logout() {
  return api.post<{ ok: true }>('/api/auth/logout')
}

export function fetchMe() {
  return api.get<{ user: UserProfile }>('/api/auth/me')
}

export function updateProfile(input: { firstName?: string; lastName?: string; phoneNumber?: string; profilePhoto?: string }) {
  return api.patch<{ user: UserProfile }>('/api/auth/me', input)
}

export function changePassword(currentPassword: string, newPassword: string) {
  return api.post<{ ok: true }>('/api/auth/change-password', { currentPassword, newPassword })
}

export function forgotPassword(email: string) {
  return api.post<{ ok: true; devOtp?: string }>('/api/auth/forgot-password', { email })
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return api.post<{ ok: true }>('/api/auth/reset-password', { email, otp, newPassword })
}
