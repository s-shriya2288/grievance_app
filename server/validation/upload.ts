import { z } from 'zod'

export const uploadAttachmentSchema = z.object({
  filename: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  dataBase64: z.string().min(1),
})
