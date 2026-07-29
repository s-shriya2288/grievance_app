import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runHandler } from '../../server/vercelAdapter.js'
import { handleMarkAllNotificationsRead } from '../../server/notificationHandlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runHandler(req, res, handleMarkAllNotificationsRead, ['POST'])
}
