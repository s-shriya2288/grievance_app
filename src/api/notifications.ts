import { api } from './client'
import type { AppNotification } from '../types/api'

export function listNotifications() {
  return api.get<{ notifications: AppNotification[] }>('/api/notifications')
}

export function markNotificationRead(id: string) {
  return api.patch<{ notification: AppNotification }>(`/api/notifications/${id}`)
}

export function markAllNotificationsRead() {
  return api.post<{ ok: true }>('/api/notifications/read-all')
}
