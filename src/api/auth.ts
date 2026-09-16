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
  return api.post<{ email: string; devOtp?: string }>('/api/auth/register', input)
}

export function verifyEmail(email: string, otp: string) {
  return api.post<{ ok: true }>('/api/auth/verify-email', { email, otp })
}

export function resendVerification(email: string) {
  return api.post<{ ok: true; devOtp?: string }>('/api/auth/resend-verification', { email })
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

export function updateProfile(input: {
  employeeId?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  profilePhoto?: string
}) {
  return api.patch<{ user: UserProfile }>('/api/auth/me', input)
}

export function changePassword(currentPassword: string, newPassword: string) {
  return api.post<{ ok: true }>('/api/auth/change-password', { currentPassword, newPassword })
}

export function requestEmailChange(newEmail: string) {
  return api.post<{ ok: true; devOtp?: string }>('/api/auth/change-email/request', { newEmail })
}

export function confirmEmailChange(otp: string) {
  return api.post<{ user: UserProfile }>('/api/auth/change-email/confirm', { otp })
}

export function forgotPassword(email: string) {
  return api.post<{ ok: true; devOtp?: string }>('/api/auth/forgot-password', { email })
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return api.post<{ ok: true }>('/api/auth/reset-password', { email, otp, newPassword })
}
