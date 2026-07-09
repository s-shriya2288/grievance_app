import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prioritizeGrievance, type PrioritizeInput } from '../server/prioritize.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const items = req.body?.items as Array<PrioritizeInput & { id: string }>
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array' })
  }
  const results = await Promise.all(
    items.map(async (item) => ({ id: item.id, ...(await prioritizeGrievance(item)) })),
  )
  res.status(200).json({ results })
}
