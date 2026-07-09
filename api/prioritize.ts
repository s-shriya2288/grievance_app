import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prioritizeGrievance, type PrioritizeInput } from '../server/prioritize.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const input = req.body as PrioritizeInput
  if (!input?.subject || !input?.description) {
    return res.status(400).json({ error: 'subject and description are required' })
  }
  const result = await prioritizeGrievance(input)
  res.status(200).json(result)
}
