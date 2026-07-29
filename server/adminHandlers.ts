import { requireAuth, requireRole } from './middleware/auth.js'
import { prisma } from './db.js'
import type { HandlerRequest, HandlerResult } from './http.js'

export async function handleListAuditLogs(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  requireRole(payload, ['Super Admin'])
  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 200,
    include: { user: { select: { firstName: true, lastName: true, employeeId: true } } },
  })
  return { statusCode: 200, body: { logs } }
}
