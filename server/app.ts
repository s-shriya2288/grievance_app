import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prioritizeGrievance, type PrioritizeInput } from './prioritize.js'
import { sendError } from './httpError.js'
import { getClientIp } from './middleware/auth.js'
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleMe,
  handleUpdateProfile,
  handleChangePassword,
  handleForgotPassword,
  handleResetPassword,
} from './auth/handlers.js'
import {
  handleCreateGrievance,
  handleListGrievances,
  handleGetGrievance,
  handleUpdateGrievanceStatus,
  handleAddComment,
  handleSubmitSatisfaction,
  handleReopenGrievance,
} from './grievance/handlers.js'
import { handleListNotifications, handleMarkNotificationRead, handleMarkAllNotificationsRead } from './notificationHandlers.js'
import { handleListDepartments, handleListCategories } from './referenceHandlers.js'
import { handleListAuditLogs } from './adminHandlers.js'
import { handleUploadAttachment } from './uploadHandlers.js'
import type { HandlerRequest, HandlerResult } from './http.js'

export const app = express()

app.use(cors())
app.use(express.json({ limit: '6mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: !!process.env.ANTHROPIC_API_KEY })
})

app.post('/api/prioritize', async (req, res) => {
  const input = req.body as PrioritizeInput
  if (!input?.subject || !input?.description) {
    return res.status(400).json({ error: 'subject and description are required' })
  }
  const result = await prioritizeGrievance(input)
  res.json(result)
})

app.post('/api/prioritize-batch', async (req, res) => {
  const items = req.body?.items as Array<PrioritizeInput & { id: string }>
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array' })
  }
  const results = await Promise.all(
    items.map(async (item) => ({ id: item.id, ...(await prioritizeGrievance(item)) })),
  )
  res.json({ results })
})

function adapt(handler: (req: HandlerRequest) => Promise<HandlerResult>) {
  return async (req: express.Request, res: express.Response) => {
    try {
      const result = await handler({
        body: req.body,
        query: req.query as Record<string, string | string[] | undefined>,
        params: req.params as Record<string, string | undefined>,
        cookieHeader: req.headers.cookie ?? null,
        ip: getClientIp(req.headers, req.socket.remoteAddress),
      })
      if (result.setCookie) res.setHeader('Set-Cookie', result.setCookie)
      res.status(result.statusCode).json(result.body)
    } catch (error) {
      sendError(res, error)
    }
  }
}

// Auth
app.post('/api/auth/register', adapt(handleRegister))
app.post('/api/auth/login', adapt(handleLogin))
app.post('/api/auth/logout', adapt(handleLogout))
app.get('/api/auth/me', adapt(handleMe))
app.patch('/api/auth/me', adapt(handleUpdateProfile))
app.post('/api/auth/change-password', adapt(handleChangePassword))
app.post('/api/auth/forgot-password', adapt(handleForgotPassword))
app.post('/api/auth/reset-password', adapt(handleResetPassword))

// Reference data
app.get('/api/departments', adapt(handleListDepartments))
app.get('/api/categories', adapt(handleListCategories))

// Grievances
app.post('/api/grievances', adapt(handleCreateGrievance))
app.get('/api/grievances', adapt(handleListGrievances))
app.get('/api/grievances/:id', adapt(handleGetGrievance))
app.patch('/api/grievances/:id', adapt(handleUpdateGrievanceStatus))
app.post('/api/grievances/:id/comments', adapt(handleAddComment))
app.post('/api/grievances/:id/satisfaction', adapt(handleSubmitSatisfaction))
app.post('/api/grievances/:id/reopen', adapt(handleReopenGrievance))

// Notifications
app.get('/api/notifications', adapt(handleListNotifications))
app.patch('/api/notifications/:id', adapt(handleMarkNotificationRead))
app.post('/api/notifications/read-all', adapt(handleMarkAllNotificationsRead))

// Admin
app.get('/api/admin/audit-logs', adapt(handleListAuditLogs))

app.post('/api/upload', adapt(handleUploadAttachment))
