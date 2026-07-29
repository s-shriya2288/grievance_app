import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../server/vercelAdapter.js'
import { handleChangePassword } from '../../server/auth/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runHandler(req, res, handleChangePassword, ['POST'])
}
