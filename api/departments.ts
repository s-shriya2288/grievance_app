import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../server/vercelAdapter.js'
import { handleListDepartments } from '../server/referenceHandlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runHandler(req, res, handleListDepartments, ['GET'])
}
