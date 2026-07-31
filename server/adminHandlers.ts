import { requireAuth, requireRole } from './middleware/auth.js'
import { prisma } from './db.js'
import { createAdminSchema } from './validation/auth.js'
import { createAdminUser, listAdminUsers } from './auth/service.js'
import { toUserDto } from './dto/user.js'
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

export async function handleListAdmins(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  requireRole(payload, ['Super Admin'])
  const admins = await listAdminUsers()
  return { statusCode: 200, body: { admins: admins.map(toUserDto) } }
}

export async function handleCreateAdmin(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  requireRole(payload, ['Super Admin'])
  const input = createAdminSchema.parse(req.body)
  const user = await createAdminUser(input, payload.sub, req.ip)
  return { statusCode: 201, body: { user: toUserDto(user) } }
}
