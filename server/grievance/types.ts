import type { z } from 'zod'
import type { createGrievanceSchema, listGrievancesQuerySchema, updateGrievanceStatusSchema } from '../validation/grievance.js'

export type CreateGrievanceInput = z.infer<typeof createGrievanceSchema>
export type UpdateGrievanceStatusInput = z.infer<typeof updateGrievanceStatusSchema>
export type ListGrievancesQuery = z.infer<typeof listGrievancesQuerySchema>
