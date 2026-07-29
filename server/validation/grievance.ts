import { z } from 'zod'

export const createGrievanceSchema = z.object({
  categoryId: z.string().uuid('Select a valid category.'),
  subcategoryId: z.string().uuid('Select a valid sub-category.'),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters.').max(200),
  description: z.string().trim().min(20, 'Please provide at least 20 characters of detail.'),
  dateOfIncident: z.string().optional().nullable(),
  personsInvolved: z.string().trim().max(300).optional().nullable(),
  isConfidential: z.boolean().optional(),
  preferredResolution: z.string().trim().max(500).optional().nullable(),
  attachment: z.string().url().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  aiPriorityReasoning: z.string().optional().nullable(),
})

export const updateGrievanceStatusSchema = z.object({
  status: z.enum(['Open', 'InProgress', 'Resolved', 'Closed']).optional(),
  resolution: z.string().trim().max(2000).optional().nullable(),
  assignedAdminId: z.string().uuid().nullable().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
})

export const addCommentSchema = z.object({
  comment: z.string().trim().min(1, 'Comment cannot be empty.').max(2000),
})

export const submitSatisfactionSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(1000).optional().nullable(),
})

export const listGrievancesQuerySchema = z.object({
  status: z.enum(['Open', 'InProgress', 'Resolved', 'Closed']).optional(),
  departmentId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  search: z.string().trim().max(200).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})
