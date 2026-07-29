import { stringifySetCookie, parseCookie } from 'cookie'

export const AUTH_COOKIE_NAME = 'dalmia_grievance_token'
const isProd = process.env.NODE_ENV === 'production'

export function buildAuthCookie(token: string, persistent = true): string {
  return stringifySetCookie({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    // Omitting maxAge makes it a session cookie that clears when the browser closes.
    ...(persistent ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  })
}

export function buildClearAuthCookie(): string {
  return stringifySetCookie({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function getTokenFromCookieHeader(cookieHeader: string | undefined | null): string | null {
  if (!cookieHeader) return null
  const cookies = parseCookie(cookieHeader)
  return cookies[AUTH_COOKIE_NAME] ?? null
}
