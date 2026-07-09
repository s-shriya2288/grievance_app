import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { seedGrievances } from '../data/mockData'
import { prioritizeBatch } from '../api/prioritize'
import type { Grievance, GrievanceAttachment, GrievanceCategory } from '../types'
import type { Employee } from '../types'

const STORAGE_KEY = 'grievance-portal:grievances'

export interface NewGrievanceInput {
  category: GrievanceCategory
  subCategory: string
  subject: string
  description: string
  dateOfIncident: string
  personsInvolved: string
  attachments: GrievanceAttachment[]
  isConfidential: boolean
  preferredResolution: string
  priority: Grievance['priority']
  aiPriorityReasoning: string
  assignedTo: string
}

interface GrievanceContextValue {
  grievances: Grievance[]
  addGrievance: (employee: Employee, input: NewGrievanceInput) => Grievance
  getGrievance: (id: string) => Grievance | undefined
  submitFeedback: (id: string, feedback: string, rating: number) => void
  reprioritizeAll: () => Promise<void>
  isReprioritizing: boolean
}

const GrievanceContext = createContext<GrievanceContextValue | undefined>(undefined)

function loadInitial(): Grievance[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fall through to seed data
    }
  }
  return seedGrievances
}

export function GrievanceProvider({ children }: { children: ReactNode }) {
  const [grievances, setGrievances] = useState<Grievance[]>(loadInitial)
  const [isReprioritizing, setIsReprioritizing] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances))
  }, [grievances])

  const addGrievance = (employee: Employee, input: NewGrievanceInput) => {
    const timestamp = new Date().toISOString()
    const grievance: Grievance = {
      id: `GRV-${1000 + grievances.length + 1}`,
      employeeId: employee.employeeCode,
      employeeName: employee.name,
      department: employee.department,
      unitLocation: employee.unitLocation,
      reportingManager: employee.reportingManager,
      ...input,
      status: 'Open',
      resolutionRemarks: '',
      employeeFeedback: '',
      closureRating: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      timeline: [{ status: 'Open', note: `Grievance submitted by employee. Routed to ${input.assignedTo}.`, timestamp }],
    }
    setGrievances((prev) => [grievance, ...prev])
    return grievance
  }

  const getGrievance = (id: string) => grievances.find((g) => g.id === id)

  const submitFeedback = (id: string, feedback: string, rating: number) => {
    const timestamp = new Date().toISOString()
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              employeeFeedback: feedback,
              closureRating: rating,
              status: 'Closed',
              updatedAt: timestamp,
              timeline: [...g.timeline, { status: 'Closed', note: 'Employee submitted feedback and closed the grievance.', timestamp }],
            }
          : g,
      ),
    )
  }

  const reprioritizeAll = async () => {
    setIsReprioritizing(true)
    try {
      const results = await prioritizeBatch(
        grievances.map((g) => ({
          id: g.id,
          category: g.category,
          subCategory: g.subCategory,
          subject: g.subject,
          description: g.description,
          personsInvolved: g.personsInvolved,
          isConfidential: g.isConfidential,
        })),
      )
      const byId = new Map(results.map((r) => [r.id, r]))
      const timestamp = new Date().toISOString()
      setGrievances((prev) =>
        prev.map((g) => {
          const result = byId.get(g.id)
          if (!result) return g
          return {
            ...g,
            priority: result.priority,
            aiPriorityReasoning: result.reasoning,
            assignedTo: result.suggestedTeam,
            updatedAt: timestamp,
          }
        }),
      )
    } finally {
      setIsReprioritizing(false)
    }
  }

  return (
    <GrievanceContext.Provider
      value={{ grievances, addGrievance, getGrievance, submitFeedback, reprioritizeAll, isReprioritizing }}
    >
      {children}
    </GrievanceContext.Provider>
  )
}

export function useGrievances() {
  const ctx = useContext(GrievanceContext)
  if (!ctx) throw new Error('useGrievances must be used within GrievanceProvider')
  return ctx
}
