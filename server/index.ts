import { app } from './app.js'

const PORT = process.env.API_PORT || 3001

app.listen(PORT, () => {
  console.log(`Grievance backend listening on http://localhost:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set — /api/prioritize will use a rule-based fallback.')
  }
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set — auth/grievance endpoints will fail until a database is configured.')
  }
})
