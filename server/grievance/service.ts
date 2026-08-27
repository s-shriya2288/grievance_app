import { prisma } from '../db.js'
import { AppError } from '../errors.js'
import { logAudit } from '../audit.js'
import { notifyUser } from '../notifications.js'
import type { CreateGrievanceInput, ListGrievancesQuery, UpdateGrievanceStatusInput } from './types.js'
import type { Prisma } from '../../generated/prisma/client.js'

const fullInclude = {
  employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
  assignedAdmin: { select: { id: true, firstName: true, lastName: true } },
  department: true,
  category: true,
  subcategory: true,
  comments: {
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'asc' },
  },
  satisfaction: true,
} satisfies Prisma.GrievanceInclude

export interface RequesterContext {
  userId: string
  role: string
  departmentId: string
}

function canAccessGrievance(grievance: { employeeId: string; departmentId: string }, requester: RequesterContext) {
  if (grievance.employeeId === requester.userId) return true
  if (requester.role === 'Super Admin') return true
  if (requester.role === 'Department Admin' && grievance.departmentId === requester.departmentId) return true
  return false
}

/**
 * A confidential submission should hide the employee's identity from
 * Department Admins (so they can't retaliate against a whistleblower who was
 * promised anonymity) — only the owning employee and a Super Admin see who
 * actually filed it.
 */
function redactConfidentialEmployee<
  T extends {
    isConfidential: boolean
    employeeId: string
    employee: { id: string; firstName: string; lastName: string; employeeId: string; email: string }
  },
>(grievance: T, requester: RequesterContext): T {
  if (!grievance.isConfidential) return grievance
  if (grievance.employeeId === requester.userId) return grievance
  if (requester.role === 'Super Admin') return grievance
  return {
    ...grievance,
    employee: { ...grievance.employee, firstName: 'Confidential', lastName: 'Submission', employeeId: '—', email: '' },
  }
}

export async function createGrievance(employeeId: string, input: CreateGrievanceInput, ipAddress: string | null) {
  const category = await prisma.grievanceCategory.findUnique({ where: { id: input.categoryId } })
  if (!category) throw new AppError('Invalid category.', 400)

  const subcategory = await prisma.grievanceSubcategory.findUnique({ where: { id: input.subcategoryId } })
  if (!subcategory || subcategory.categoryId !== category.id) throw new AppError('Invalid sub-category.', 400)

  const ticketCount = await prisma.grievance.count()
  const ticketNumber = `GRV-${1000 + ticketCount + 1}`

  const grievance = await prisma.grievance.create({
    data: {
      ticketNumber,
      employeeId,
      departmentId: category.departmentId,
      categoryId: category.id,
      subcategoryId: subcategory.id,
      subject: input.subject,
      description: input.description,
      dateOfIncident: input.dateOfIncident ? new Date(input.dateOfIncident) : null,
      personsInvolved: input.personsInvolved || null,
      isConfidential: input.isConfidential ?? false,
      preferredResolution: input.preferredResolution || null,
      attachment: input.attachment || null,
      priority: input.priority ?? 'Medium',
      aiPriorityReasoning: input.aiPriorityReasoning || null,
      status: 'Open',
    },
    include: fullInclude,
  })

  await logAudit({
    userId: employeeId,
    action: 'GRIEVANCE_CREATED',
    entity: 'Grievance',
    entityId: grievance.id,
    ipAddress,
  })

  await notifyUser(employeeId, {
    title: `Grievance ${ticketNumber} submitted`,
    message: `Your grievance has been submitted and routed to the ${category.departmentId ? grievance.department.departmentName : ''} team.`,
    type: 'TicketSubmitted',
  })

  const admins = await prisma.user.findMany({
    where: { departmentId: category.departmentId, role: { roleName: { in: ['Department Admin', 'Super Admin'] } } },
  })
  await Promise.all(
    admins.map((admin) =>
      notifyUser(admin.id, {
        title: `New grievance: ${ticketNumber}`,
        message: `${input.subject}`,
        type: 'Assigned',
      }),
    ),
  )

  return grievance
}

export async function listMyGrievances(employeeId: string) {
  return prisma.grievance.findMany({ where: { employeeId }, include: fullInclude, orderBy: { createdAt: 'desc' } })
}

export async function listGrievancesForAdmin(requester: RequesterContext, filters: ListGrievancesQuery) {
  const where: Prisma.GrievanceWhereInput = {}

  if (requester.role === 'Department Admin') {
    where.departmentId = requester.departmentId
  } else if (requester.role !== 'Super Admin') {
    throw new AppError('You do not have permission to view this list.', 403)
  }

  if (filters.status) where.status = filters.status
  if (filters.priority) where.priority = filters.priority
  if (filters.categoryId) where.categoryId = filters.categoryId
  if (requester.role === 'Super Admin' && filters.departmentId) where.departmentId = filters.departmentId
  if (filters.search) {
    where.OR = [
      { subject: { contains: filters.search, mode: 'insensitive' } },
      { ticketNumber: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: new Date(filters.from) } : {}),
      ...(filters.to ? { lte: new Date(filters.to) } : {}),
    }
  }

  const grievances = await prisma.grievance.findMany({ where, include: fullInclude, orderBy: { createdAt: 'desc' } })
  return grievances.map((g) => redactConfidentialEmployee(g, requester))
}

export async function getGrievanceById(id: string, requester: RequesterContext) {
  const grievance = await prisma.grievance.findUnique({ where: { id }, include: fullInclude })
  if (!grievance) throw new AppError('Grievance not found.', 404)
  if (!canAccessGrievance(grievance, requester)) {
    throw new AppError('You do not have access to this grievance.', 403)
  }
  return redactConfidentialEmployee(grievance, requester)
}

export async function updateGrievanceStatus(id: string, requester: RequesterContext, input: UpdateGrievanceStatusInput) {
  const grievance = await prisma.grievance.findUnique({ where: { id } })
  if (!grievance) throw new AppError('Grievance not found.', 404)
  if (requester.role === 'Employee') throw new AppError('Not authorized.', 403)
  if (requester.role === 'Department Admin' && grievance.departmentId !== requester.departmentId) {
    throw new AppError('Not authorized.', 403)
  }

  const data: Prisma.GrievanceUpdateInput = {}
  if (input.status) {
    data.status = input.status
    if (input.status === 'Resolved') data.resolvedAt = new Date()
    if (input.status === 'Closed') data.closedAt = new Date()
  }
  if (input.resolution !== undefined) data.resolution = input.resolution
  if (input.assignedAdminId !== undefined) {
    if (input.assignedAdminId) {
      const targetAdmin = await prisma.user.findUnique({
        where: { id: input.assignedAdminId },
        include: { role: true },
      })
      const isValidAdmin =
        targetAdmin &&
        (targetAdmin.role.roleName === 'Super Admin' ||
          (targetAdmin.role.roleName === 'Department Admin' && targetAdmin.departmentId === grievance.departmentId))
      if (!isValidAdmin) throw new AppError('Select a valid admin for this department.', 400)
      data.assignedAdmin = { connect: { id: input.assignedAdminId } }
    } else {
      data.assignedAdmin = { disconnect: true }
    }
  }
  if (input.priority) data.priority = input.priority

  const updated = await prisma.grievance.update({ where: { id }, data, include: fullInclude })

  await logAudit({ userId: requester.userId, action: 'GRIEVANCE_STATUS_CHANGED', entity: 'Grievance', entityId: id })

  if (input.status) {
    await notifyUser(updated.employeeId, {
      title: `Grievance ${updated.ticketNumber}: ${input.status}`,
      message:
        input.status === 'Resolved'
          ? 'Your grievance has been marked Resolved. Please review and confirm.'
          : `Your grievance status is now ${input.status}.`,
      type: input.status === 'Resolved' ? 'Resolved' : input.status === 'Closed' ? 'Closed' : 'StatusChanged',
    })
  }

  return redactConfidentialEmployee(updated, requester)
}

export async function addComment(grievanceId: string, requester: RequesterContext, comment: string) {
  const grievance = await prisma.grievance.findUnique({ where: { id: grievanceId } })
  if (!grievance) throw new AppError('Grievance not found.', 404)
  if (!canAccessGrievance(grievance, requester)) throw new AppError('You do not have access to this grievance.', 403)

  const created = await prisma.grievanceComment.create({
    data: { grievanceId, userId: requester.userId, comment },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  })

  await logAudit({ userId: requester.userId, action: 'GRIEVANCE_COMMENT_ADDED', entity: 'Grievance', entityId: grievanceId })

  const notifyTargetId = grievance.employeeId === requester.userId ? grievance.assignedAdminId : grievance.employeeId
  if (notifyTargetId) {
    await notifyUser(notifyTargetId, {
      title: `New comment on ${grievance.ticketNumber}`,
      message: comment.slice(0, 140),
      type: 'StatusChanged',
    })
  }

  return created
}

export async function submitSatisfaction(grievanceId: string, employeeId: string, rating: number, feedback: string | null) {
  const grievance = await prisma.grievance.findUnique({ where: { id: grievanceId } })
  if (!grievance) throw new AppError('Grievance not found.', 404)
  if (grievance.employeeId !== employeeId) throw new AppError('Not authorized.', 403)
  if (grievance.status !== 'Resolved') throw new AppError('This grievance is not yet marked Resolved.', 400)

  await prisma.satisfaction.upsert({
    where: { grievanceId },
    update: { rating, feedback },
    create: { grievanceId, rating, feedback },
  })

  const updated = await prisma.grievance.update({
    where: { id: grievanceId },
    data: { status: 'Closed', closedAt: new Date() },
    include: fullInclude,
  })

  await logAudit({ userId: employeeId, action: 'GRIEVANCE_CLOSED_WITH_FEEDBACK', entity: 'Grievance', entityId: grievanceId })

  if (updated.assignedAdminId) {
    await notifyUser(updated.assignedAdminId, {
      title: `Grievance ${updated.ticketNumber} closed`,
      message: `Employee rated the resolution ${rating}/5.`,
      type: 'Closed',
    })
  }

  return updated
}

export async function reopenGrievance(grievanceId: string, employeeId: string) {
  const grievance = await prisma.grievance.findUnique({ where: { id: grievanceId } })
  if (!grievance) throw new AppError('Grievance not found.', 404)
  if (grievance.employeeId !== employeeId) throw new AppError('Not authorized.', 403)
  if (grievance.status !== 'Resolved' && grievance.status !== 'Closed') {
    throw new AppError('Only a Resolved or Closed grievance can be reopened.', 400)
  }

  const updated = await prisma.grievance.update({
    where: { id: grievanceId },
    data: { status: 'Open', resolvedAt: null, closedAt: null, reopenCount: { increment: 1 } },
    include: fullInclude,
  })

  await logAudit({ userId: employeeId, action: 'GRIEVANCE_REOPENED', entity: 'Grievance', entityId: grievanceId })

  if (updated.assignedAdminId) {
    await notifyUser(updated.assignedAdminId, {
      title: `Grievance ${updated.ticketNumber} reopened`,
      message: 'The employee reopened this grievance because the issue persists.',
      type: 'Reopened',
    })
  }

  return updated
}
