import { put } from '@vercel/blob'
import { AppError } from './errors.js'

const MAX_FILE_BYTES = 4 * 1024 * 1024
const ALLOWED_CONTENT_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])

export interface UploadAttachmentInput {
  filename: string
  contentType: string
  dataBase64: string
}

export async function uploadAttachment(input: UploadAttachmentInput): Promise<{ url: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new AppError('File uploads are not configured. Set BLOB_READ_WRITE_TOKEN to enable them.', 503)
  }
  if (!ALLOWED_CONTENT_TYPES.has(input.contentType)) {
    throw new AppError('Only PNG, JPEG, WEBP, or PDF files are allowed.', 400)
  }

  const buffer = Buffer.from(input.dataBase64, 'base64')
  if (buffer.byteLength > MAX_FILE_BYTES) {
    throw new AppError('File is too large. Maximum size is 4 MB.', 400)
  }

  const blob = await put(input.filename, buffer, {
    access: 'public',
    contentType: input.contentType,
    addRandomSuffix: true,
  })

  return { url: blob.url }
}
