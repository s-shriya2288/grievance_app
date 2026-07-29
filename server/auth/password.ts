import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export function isStrongPassword(password: string): boolean {
  return PASSWORD_RULE.test(password)
}

export const PASSWORD_REQUIREMENTS =
  'At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.'
