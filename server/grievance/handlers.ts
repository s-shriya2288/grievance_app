import { requireAuth } from '../middleware/auth.js'
import { AppError } from '../errors.js'
import {
  createGrievanceSchema,
  updateGrievanceStatusSchema,
  addCommentSchema,
  submitSatisfactionSchema,
  listGrievancesQuerySchema,
} from '../validation/grievance.js'
import {
  createGrievance,
  listMyGrievances,
  listGrievancesForAdmin,
  getGrievanceById,
  updateGrievanceStatus,
  addComment,
  submitSatisfaction,
  reopenGrievance,
  type RequesterContext,
} from './service.js'
import type { HandlerRequest, HandlerResult } from '../http.js'

function toRequesterContext(payload: { sub: string; role: string; departmentId: string }): RequesterContext {
  return { userId: payload.sub, role: payload.role, departmentId: payload.departmentId }
}

function requireId(params: Record<string, string | undefined>): string {
  const id = params.id
  if (!id) throw new AppError('Missing grievance id.', 400)
  return id
}

export async function handleCreateGrievance(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const input = createGrievanceSchema.parse(req.body)
  const grievance = await createGrievance(payload.sub, input, req.ip)
  return { statusCode: 201, body: { grievance } }
}

export async function handleListGrievances(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  if (payload.role === 'Employee') {
    const grievances = await listMyGrievances(payload.sub)
    return { statusCode: 200, body: { grievances } }
  }
  const filters = listGrievancesQuerySchema.parse(req.query)
  const grievances = await listGrievancesForAdmin(toRequesterContext(payload), filters)
  return { statusCode: 200, body: { grievances } }
}

export async function handleGetGrievance(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const id = requireId(req.params)
  const grievance = await getGrievanceById(id, toRequesterContext(payload))
  return { statusCode: 200, body: { grievance } }
}

export async function handleUpdateGrievanceStatus(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const id = requireId(req.params)
  const input = updateGrievanceStatusSchema.parse(req.body)
  const grievance = await updateGrievanceStatus(id, toRequesterContext(payload), input)
  return { statusCode: 200, body: { grievance } }
}

export async function handleAddComment(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const id = requireId(req.params)
  const input = addCommentSchema.parse(req.body)
  const comment = await addComment(id, toRequesterContext(payload), input.comment)
  return { statusCode: 201, body: { comment } }
}

export async function handleSubmitSatisfaction(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const id = requireId(req.params)
  const input = submitSatisfactionSchema.parse(req.body)
  const grievance = await submitSatisfaction(id, payload.sub, input.rating, input.feedback ?? null)
  return { statusCode: 200, body: { grievance } }
}

export async function handleReopenGrievance(req: HandlerRequest): Promise<HandlerResult> {
  const payload = requireAuth(req.cookieHeader)
  const id = requireId(req.params)
  const grievance = await reopenGrievance(id, payload.sub)
  return { statusCode: 200, body: { grievance } }
}
