import { z } from 'zod'
import { companyEmail } from './auth.js'

export const updateDepartmentHeadEmailSchema = z.object({
  headEmail: companyEmail.nullable(),
})
