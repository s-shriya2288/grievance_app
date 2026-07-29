import jwt from 'jsonwebtoken'
import { AppError } from '../errors.js'

export interface AuthTokenPayload {
  sub: string
  employeeId: string
  role: string
  departmentId: string
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new AppError('JWT_SECRET is not configured on the server.', 500)
  return secret
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, getSecret(), { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] })
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getSecret()) as AuthTokenPayload
}
