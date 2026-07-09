import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prioritizeGrievance, type PrioritizeInput } from './prioritize.js'

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: !!process.env.ANTHROPIC_API_KEY })
})

app.post('/api/prioritize', async (req, res) => {
  const input = req.body as PrioritizeInput
  if (!input?.subject || !input?.description) {
    return res.status(400).json({ error: 'subject and description are required' })
  }
  const result = await prioritizeGrievance(input)
  res.json(result)
})

app.post('/api/prioritize-batch', async (req, res) => {
  const items = req.body?.items as Array<PrioritizeInput & { id: string }>
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array' })
  }
  const results = await Promise.all(
    items.map(async (item) => ({ id: item.id, ...(await prioritizeGrievance(item)) })),
  )
  res.json({ results })
})

app.listen(PORT, () => {
  console.log(`Grievance AI backend listening on http://localhost:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set — /api/prioritize will use a rule-based fallback.')
  }
})
