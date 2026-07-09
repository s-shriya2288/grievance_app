import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { seedGrievances } from '../data/mockData'
import type { Grievance, GrievanceCategory, GrievancePriority } from '../types'

const STORAGE_KEY = 'grievance-portal:grievances'

interface NewGrievanceInput {
  subject: string
  description: string
  category: GrievanceCategory
  priority: GrievancePriority
  isAnonymous: boolean
}

interface GrievanceContextValue {
  grievances: Grievance[]
  addGrievance: (input: NewGrievanceInput) => Grievance
  getGrievance: (id: string) => Grievance | undefined
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances))
  }, [grievances])

  const addGrievance = (input: NewGrievanceInput) => {
    const timestamp = new Date().toISOString()
    const grievance: Grievance = {
      id: `GRV-${1000 + grievances.length + 1}`,
      ...input,
      status: 'Submitted',
      createdAt: timestamp,
      updatedAt: timestamp,
      timeline: [{ status: 'Submitted', note: 'Grievance submitted by employee.', timestamp }],
    }
    setGrievances((prev) => [grievance, ...prev])
    return grievance
  }

  const getGrievance = (id: string) => grievances.find((g) => g.id === id)

  return (
    <GrievanceContext.Provider value={{ grievances, addGrievance, getGrievance }}>
      {children}
    </GrievanceContext.Provider>
  )
}

export function useGrievances() {
  const ctx = useContext(GrievanceContext)
  if (!ctx) throw new Error('useGrievances must be used within GrievanceProvider')
  return ctx
}
