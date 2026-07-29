import { AppError } from '../errors.js'
import { verifyAuthToken, type AuthTokenPayload } from '../auth/jwt.js'
import { getTokenFromCookieHeader } from '../auth/cookie.js'

export function requireAuth(cookieHeader: string | undefined | null): AuthTokenPayload {
  const token = getTokenFromCookieHeader(cookieHeader)
  if (!token) throw new AppError('Not authenticated.', 401)
  try {
    return verifyAuthToken(token)
  } catch {
    throw new AppError('Session expired. Please log in again.', 401)
  }
}

export function requireRole(payload: AuthTokenPayload, allowed: string[]): void {
  if (!allowed.includes(payload.role)) {
    throw new AppError('You do not have permission to perform this action.', 403)
  }
}

export function getClientIp(headers: Record<string, string | string[] | undefined>, fallback?: string): string | null {
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  if (Array.isArray(forwarded) && forwarded.length > 0) return forwarded[0]
  return fallback ?? null
}
