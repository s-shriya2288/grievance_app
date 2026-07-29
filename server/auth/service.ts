import { prisma } from '../db.js'
import { AppError } from '../errors.js'
import { hashPassword, verifyPassword } from './password.js'
import { signAuthToken } from './jwt.js'
import { generateOtp, hashOtp, otpMatches, OTP_TTL_MINUTES } from './otp.js'
import { sendEmail } from '../email.js'
import { otpEmailTemplate } from '../email/templates.js'
import { logAudit } from '../audit.js'
import type { registerSchema, updateProfileSchema } from '../validation/auth.js'
import type { z } from 'zod'

const userWithRelations = { role: true, department: true } as const

export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export async function registerUser(input: RegisterInput, ipAddress: string | null) {
  const [existingByEmployeeId, existingByEmail, department, role] = await Promise.all([
    prisma.user.findUnique({ where: { employeeId: input.employeeId } }),
    prisma.user.findUnique({ where: { email: input.email } }),
    prisma.department.findUnique({ where: { id: input.departmentId } }),
    prisma.role.findUnique({ where: { roleName: 'Employee' } }),
  ])

  if (existingByEmployeeId) throw new AppError('This Employee ID is already registered.', 409)
  if (existingByEmail) throw new AppError('This email is already registered.', 409)
  if (!department) throw new AppError('Select a valid department.', 400)
  if (!role) throw new AppError('The Employee role has not been seeded. Run `npm run db:seed`.', 500)

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      employeeId: input.employeeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber || null,
      passwordHash,
      departmentId: department.id,
      roleId: role.id,
    },
    include: userWithRelations,
  })

  await logAudit({ userId: user.id, action: 'REGISTER', entity: 'User', entityId: user.id, ipAddress })

  return user
}

export async function loginUser(identifier: string, password: string, ipAddress: string | null) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { employeeId: identifier }] },
    include: userWithRelations,
  })

  if (!user) throw new AppError('Invalid Employee ID/email or password.', 401)
  if (user.accountStatus !== 'Active') {
    throw new AppError('Your account is not active. Contact HR.', 403)
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) throw new AppError('Invalid Employee ID/email or password.', 401)

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
  await logAudit({ userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, ipAddress })

  const token = signAuthToken({
    sub: user.id,
    employeeId: user.employeeId,
    role: user.role.roleName,
    departmentId: user.departmentId,
  })

  return { token, user }
}

export async function requestPasswordReset(email: string): Promise<{ devOtp?: string }> {
  const user = await prisma.user.findUnique({ where: { email } })
  // Respond the same way whether or not the account exists, so we don't leak registered emails.
  if (!user) return {}

  const otp = generateOtp()
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetOtpHash: hashOtp(otp),
      resetOtpExpiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    },
  })

  const result = await sendEmail({
    to: user.email,
    subject: 'Your Dalmia Rajgangpur Grievance Portal password reset code',
    html: otpEmailTemplate(otp),
  })

  await logAudit({ userId: user.id, action: 'PASSWORD_RESET_REQUESTED', entity: 'User', entityId: user.id })

  // Only echo the OTP back when no email provider is configured, so the flow
  // stays testable in dev/demo without real email delivery.
  return result.sent ? {} : { devOtp: otp }
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
    throw new AppError('Invalid or expired code.', 400)
  }
  if (user.resetOtpExpiresAt.getTime() < Date.now()) {
    throw new AppError('This code has expired. Request a new one.', 400)
  }
  if (!otpMatches(otp, user.resetOtpHash)) {
    throw new AppError('Invalid or expired code.', 400)
  }

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetOtpHash: null, resetOtpExpiresAt: null },
  })
  await logAudit({ userId: user.id, action: 'PASSWORD_RESET', entity: 'User', entityId: user.id })
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError('User not found.', 404)

  const valid = await verifyPassword(currentPassword, user.passwordHash)
  if (!valid) throw new AppError('Current password is incorrect.', 400)

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  await logAudit({ userId, action: 'PASSWORD_CHANGED', entity: 'User', entityId: userId })
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: userWithRelations })
  if (!user) throw new AppError('User not found.', 404)
  return user
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({ where: { id: userId }, data: input, include: userWithRelations })
}
