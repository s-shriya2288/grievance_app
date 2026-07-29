import { randomInt, createHash } from 'node:crypto'

export const OTP_TTL_MINUTES = 10

export function generateOtp(): string {
  return randomInt(100000, 999999).toString()
}

export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex')
}

export function otpMatches(otp: string, hash: string): boolean {
  return hashOtp(otp) === hash
}
