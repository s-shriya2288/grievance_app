import { ZodError } from 'zod'
import { AppError } from './errors.js'

interface MinimalResponse {
  status(code: number): { json(body: unknown): unknown }
}

export function sendError(res: MinimalResponse, error: unknown): void {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Invalid input.'
    res.status(400).json({ error: message, issues: error.issues })
    return
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}
