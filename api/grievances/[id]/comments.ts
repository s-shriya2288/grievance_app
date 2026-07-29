import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../../server/vercelAdapter.js'
import { handleAddComment } from '../../../server/grievance/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runHandler(req, res, handleAddComment, ['POST'])
}
