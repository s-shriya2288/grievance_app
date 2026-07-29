import { requireAuth } from './middleware/auth.js'
import { AppError } from './errors.js'
import { listNotifications, markNotificationRead, markAllNotificationsRead } from './notifications.js'
import type { HandlerRequest, HandlerResult } from './http.js'

export async function handleListNotifications(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const notifications = await listNotifications(payload.sub)
  return { statusCode: 200, body: { notifications } }
}

export async function handleMarkNotificationRead(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const id = req.params.id
  if (!id) throw new AppError('Missing notification id.', 400)
  const notification = await markNotificationRead(payload.sub, id)
  return { statusCode: 200, body: { notification } }
}

export async function handleMarkAllNotificationsRead(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  await markAllNotificationsRead(payload.sub)
  return { statusCode: 200, body: { ok: true } }
}
