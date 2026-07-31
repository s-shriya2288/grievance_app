import { api } from './client'
import type { UserProfile } from '../types/api'

export interface AuditLogEntry {
  id: string
  userId: string | null
  action: string
  entity: string
  entityId: string | null
  ipAddress: string | null
  timestamp: string
  user: { firstName: string; lastName: string; employeeId: string } | null
}

export function listAuditLogs() {
  return api.get<{ logs: AuditLogEntry[] }>('/api/admin/audit-logs')
}

export interface CreateAdminInput {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  departmentId: string
  role: 'Department Admin' | 'Super Admin'
  password: string
}

export function listAdminUsers() {
  return api.get<{ admins: UserProfile[] }>('/api/admin/users')
}

export function createAdminUser(input: CreateAdminInput) {
  return api.post<{ user: UserProfile }>('/api/admin/users', input)
}
