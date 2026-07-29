import { requireAuth } from './middleware/auth.js'
import { uploadAttachmentSchema } from './validation/upload.js'
import { uploadAttachment } from './upload.js'
import type { HandlerRequest, HandlerResult } from './http.js'

export async function handleUploadAttachment(req: HandlerRequest): Promise<HandlerResult> {
  requireAuth(req.cookieHeader)
  const input = uploadAttachmentSchema.parse(req.body)
  const result = await uploadAttachment(input)
  return { statusCode: 201, body: result }
}
