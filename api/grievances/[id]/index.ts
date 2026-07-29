import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../../server/vercelAdapter.js'
import { handleGetGrievance, handleUpdateGrievanceStatus } from '../../../server/grievance/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'PATCH') {
    await runHandler(req, res, handleUpdateGrievanceStatus, ['PATCH'])
    return
  }
  await runHandler(req, res, handleGetGrievance, ['GET'])
}
