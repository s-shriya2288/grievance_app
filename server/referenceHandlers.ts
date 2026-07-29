import { listDepartments, listCategories } from './reference.js'
import type { HandlerResult } from './http.js'

export async function handleListDepartments(): Promise<HandlerResult> {
  return { statusCode: 200, body: { departments: await listDepartments() } }
}

export async function handleListCategories(): Promise<HandlerResult> {
  return { statusCode: 200, body: { categories: await listCategories() } }
}
