import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../server/vercelAdapter.js'
import { handleListAuditLogs } from '../../server/adminHandlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runHandler(req, res, handleListAuditLogs, ['GET'])
}
