import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validation/auth.js'
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
} from './service.js'
import { toUserDto } from '../dto/user.js'
import { requireAuth } from '../middleware/auth.js'
import { buildAuthCookie, buildClearAuthCookie } from './cookie.js'
import type { HandlerRequest, HandlerResult } from '../http.js'

export async function handleRegister(req: HandlerRequest): Promise<HandlerResult> {
  const input = registerSchema.parse(req.body)
  const user = await registerUser(input, req.ip)
  return { statusCode: 201, body: { user: toUserDto(user) } }
}

export async function handleLogin(req: HandlerRequest): Promise<HandlerResult> {
  const input = loginSchema.parse(req.body)
  const { token, user } = await loginUser(input.identifier, input.password, req.ip)
  return {
    statusCode: 200,
    body: { user: toUserDto(user) },
    setCookie: buildAuthCookie(token, input.rememberMe ?? true),
  }
}

export async function handleLogout(): Promise<HandlerResult> {
  return { statusCode: 200, body: { ok: true }, setCookie: buildClearAuthCookie() }
}

export async function handleMe(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const user = await getUserProfile(payload.sub)
  return { statusCode: 200, body: { user: toUserDto(user) } }
}

export async function handleUpdateProfile(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const input = updateProfileSchema.parse(req.body)
  const user = await updateUserProfile(payload.sub, input)
  return { statusCode: 200, body: { user: toUserDto(user) } }
}

export async function handleChangePassword(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const input = changePasswordSchema.parse(req.body)
  await changePassword(payload.sub, input.currentPassword, input.newPassword)
  return { statusCode: 200, body: { ok: true } }
}

export async function handleForgotPassword(req: HandlerRequest): Promise<HandlerResult> {
  const input = forgotPasswordSchema.parse(req.body)
  const result = await requestPasswordReset(input.email)
  return { statusCode: 200, body: { ok: true, devOtp: result.devOtp } }
}

export async function handleResetPassword(req: HandlerRequest): Promise<HandlerResult> {
  const input = resetPasswordSchema.parse(req.body)
  await resetPassword(input.email, input.otp, input.newPassword)
  return { statusCode: 200, body: { ok: true } }
}
