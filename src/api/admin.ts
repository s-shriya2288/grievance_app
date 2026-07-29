import { api } from './client'

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
