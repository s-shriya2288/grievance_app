import { prisma } from './db.js'

export interface AuditInput {
  userId?: string | null
  action: string
  entity: string
  entityId?: string | null
  ipAddress?: string | null
}

export async function logAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        ipAddress: input.ipAddress ?? null,
      },
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}
