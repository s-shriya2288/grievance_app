import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendError } from './httpError.js'
import { getClientIp } from './middleware/auth.js'
import type { HandlerRequest, HandlerResult } from './http.js'

export async function runHandler(
  req: VercelRequest,
  res: VercelResponse,
  handler: (req: HandlerRequest) => Promise<HandlerResult>,
  allowedMethods: string[],
): Promise<void> {
  if (!allowedMethods.includes(req.method ?? '')) {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const result = await handler({
      body: req.body,
      query: req.query as Record<string, string | string[] | undefined>,
      params: req.query as Record<string, string | undefined>,
      cookieHeader: req.headers.cookie ?? null,
      ip: getClientIp(req.headers, req.socket?.remoteAddress),
    })
    if (result.setCookie) res.setHeader('Set-Cookie', result.setCookie)
    res.status(result.statusCode).json(result.body)
  } catch (error) {
    sendError(res, error)
  }
}
