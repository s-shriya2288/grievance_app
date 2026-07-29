import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../server/vercelAdapter.js'
import { handleMe, handleUpdateProfile } from '../../server/auth/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'PATCH') {
    await runHandler(req, res, handleUpdateProfile, ['PATCH'])
    return
  }
  await runHandler(req, res, handleMe, ['GET'])
}
