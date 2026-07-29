import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../server/vercelAdapter.js'
import { handleCreateGrievance, handleListGrievances } from '../../server/grievance/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    await runHandler(req, res, handleCreateGrievance, ['POST'])
    return
  }
  await runHandler(req, res, handleListGrievances, ['GET'])
}
