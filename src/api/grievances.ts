import { api } from './client'
import type { Grievance, GrievancePriority, GrievanceStatus } from '../types/api'

export interface CreateGrievanceInput {
  categoryId: string
  subcategoryId: string
  subject: string
  description: string
  dateOfIncident?: string | null
  personsInvolved?: string | null
  isConfidential?: boolean
  preferredResolution?: string | null
  priority?: GrievancePriority
  aiPriorityReasoning?: string | null
}

export function createGrievance(input: CreateGrievanceInput) {
  return api.post<{ grievance: Grievance }>('/api/grievances', input)
}

export interface ListGrievancesFilters {
  status?: GrievanceStatus
  departmentId?: string
  categoryId?: string
  priority?: GrievancePriority
  search?: string
  from?: string
  to?: string
}

export function listGrievances(filters: ListGrievancesFilters = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value)
  }
  const qs = params.toString()
  return api.get<{ grievances: Grievance[] }>(`/api/grievances${qs ? `?${qs}` : ''}`)
}

export function getGrievance(id: string) {
  return api.get<{ grievance: Grievance }>(`/api/grievances/${id}`)
}

export interface UpdateGrievanceStatusInput {
  status?: GrievanceStatus
  resolution?: string | null
  assignedAdminId?: string | null
  priority?: GrievancePriority
}

export function updateGrievanceStatus(id: string, input: UpdateGrievanceStatusInput) {
  return api.patch<{ grievance: Grievance }>(`/api/grievances/${id}`, input)
}

export function addComment(id: string, comment: string) {
  return api.post<{ comment: unknown }>(`/api/grievances/${id}/comments`, { comment })
}

export function submitSatisfaction(id: string, rating: number, feedback: string) {
  return api.post<{ grievance: Grievance }>(`/api/grievances/${id}/satisfaction`, { rating, feedback })
}

export function reopenGrievance(id: string) {
  return api.post<{ grievance: Grievance }>(`/api/grievances/${id}/reopen`)
}
