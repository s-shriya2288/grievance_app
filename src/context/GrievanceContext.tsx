import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import * as grievanceApi from '../api/grievances'
import { useAuth } from './AuthContext'
import type { Grievance } from '../types/api'

interface GrievanceContextValue {
  grievances: Grievance[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  createGrievance: (input: grievanceApi.CreateGrievanceInput) => Promise<Grievance>
  getGrievance: (id: string) => Grievance | undefined
  fetchGrievance: (id: string) => Promise<Grievance>
  addComment: (id: string, comment: string) => Promise<void>
  submitSatisfaction: (id: string, rating: number, feedback: string) => Promise<void>
  reopenGrievance: (id: string) => Promise<void>
  updateStatus: (id: string, input: grievanceApi.UpdateGrievanceStatusInput) => Promise<void>
}

const GrievanceContext = createContext<GrievanceContextValue | undefined>(undefined)

export function GrievanceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setGrievances([])
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const { grievances } = await grievanceApi.listGrievances()
      setGrievances(grievances)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grievances.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createGrievance = async (input: grievanceApi.CreateGrievanceInput) => {
    const { grievance } = await grievanceApi.createGrievance(input)
    setGrievances((prev) => [grievance, ...prev])
    return grievance
  }

  const getGrievance = (id: string) => grievances.find((g) => g.id === id)

  const fetchGrievance = async (id: string) => {
    const { grievance } = await grievanceApi.getGrievance(id)
    setGrievances((prev) => {
      const exists = prev.some((g) => g.id === id)
      return exists ? prev.map((g) => (g.id === id ? grievance : g)) : [grievance, ...prev]
    })
    return grievance
  }

  const addComment = async (id: string, comment: string) => {
    await grievanceApi.addComment(id, comment)
    await fetchGrievance(id)
  }

  const submitSatisfaction = async (id: string, rating: number, feedback: string) => {
    const { grievance } = await grievanceApi.submitSatisfaction(id, rating, feedback)
    setGrievances((prev) => prev.map((g) => (g.id === id ? grievance : g)))
  }

  const reopenGrievance = async (id: string) => {
    const { grievance } = await grievanceApi.reopenGrievance(id)
    setGrievances((prev) => prev.map((g) => (g.id === id ? grievance : g)))
  }

  const updateStatus = async (id: string, input: grievanceApi.UpdateGrievanceStatusInput) => {
    const { grievance } = await grievanceApi.updateGrievanceStatus(id, input)
    setGrievances((prev) => prev.map((g) => (g.id === id ? grievance : g)))
  }

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        isLoading,
        error,
        refresh,
        createGrievance,
        getGrievance,
        fetchGrievance,
        addComment,
        submitSatisfaction,
        reopenGrievance,
        updateStatus,
      }}
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
