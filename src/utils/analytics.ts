import type { Grievance } from '../types/api'

export function getResolutionDays(grievance: Grievance): number | null {
  if (!grievance.resolvedAt) return null
  const created = new Date(grievance.createdAt).getTime()
  const resolved = new Date(grievance.resolvedAt).getTime()
  return (resolved - created) / (1000 * 60 * 60 * 24)
}

export function averageResolutionDays(grievances: Grievance[]): number | null {
  const days = grievances.map(getResolutionDays).filter((d): d is number => d !== null)
  if (days.length === 0) return null
  return days.reduce((sum, d) => sum + d, 0) / days.length
}

export interface CountEntry {
  label: string
  count: number
}

export function countBy(grievances: Grievance[], key: (g: Grievance) => string): CountEntry[] {
  const map = new Map<string, number>()
  for (const g of grievances) {
    const k = key(g)
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export interface AreaResolutionEntry {
  label: string
  count: number
  avgResolutionDays: number | null
}

export function averageResolutionByGroup(grievances: Grievance[], key: (g: Grievance) => string): AreaResolutionEntry[] {
  const groups = new Map<string, Grievance[]>()
  for (const g of grievances) {
    const k = key(g)
    const list = groups.get(k) ?? []
    list.push(g)
    groups.set(k, list)
  }
  return Array.from(groups.entries())
    .map(([label, items]) => ({
      label,
      count: items.length,
      avgResolutionDays: averageResolutionDays(items),
    }))
    .sort((a, b) => b.count - a.count)
}
