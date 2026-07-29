import { z } from 'zod'
import { PASSWORD_REQUIREMENTS, isStrongPassword } from '../auth/password.js'

const strongPassword = z.string().min(8).max(72).refine(isStrongPassword, PASSWORD_REQUIREMENTS)

export const registerSchema = z
  .object({
    employeeId: z.string().trim().min(2).max(30),
    firstName: z.string().trim().min(1).max(60),
    lastName: z.string().trim().min(1).max(60),
    email: z.string().trim().toLowerCase().email(),
    phoneNumber: z.string().trim().min(7).max(20).optional(),
    departmentId: z.string().uuid('Select a valid department.'),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Enter your Employee ID or company email.'),
  password: z.string().min(1, 'Enter your password.'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  otp: z.string().length(6, 'Enter the 6-digit code.'),
  newPassword: strongPassword,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: strongPassword,
})

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(60).optional(),
  lastName: z.string().trim().min(1).max(60).optional(),
  phoneNumber: z.string().trim().min(7).max(20).optional(),
  profilePhoto: z.string().url().optional(),
})
