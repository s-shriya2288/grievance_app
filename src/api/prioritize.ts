import type { GrievanceCategory, GrievancePriority } from '../types'

// In the web dev server this stays empty and Vite proxies /api to the local
// backend. The packaged Android app has no dev proxy, so builds targeting it
// must set VITE_API_BASE_URL to a reachable backend origin (see README).
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export interface PrioritizeRequest {
  category: GrievanceCategory
  subCategory: string
  subject: string
  description: string
  personsInvolved: string
  isConfidential: boolean
}

export interface PrioritizeResponse {
  priority: GrievancePriority
  reasoning: string
  suggestedTeam: string
}

export async function prioritizeGrievance(input: PrioritizeRequest): Promise<PrioritizeResponse> {
  const res = await fetch(`${API_BASE}/api/prioritize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to get an AI priority for this grievance.')
  return res.json()
}

export async function prioritizeBatch(
  items: Array<PrioritizeRequest & { id: string }>,
): Promise<Array<PrioritizeResponse & { id: string }>> {
  const res = await fetch(`${API_BASE}/api/prioritize-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error('Failed to re-run AI prioritization.')
  const data = await res.json()
  return data.results
}
