import { api } from './client'
import type { CategoryOption, DepartmentOption } from '../types/api'

export function fetchDepartments() {
  return api.get<{ departments: DepartmentOption[] }>('/api/departments')
}

export function fetchCategories() {
  return api.get<{ categories: CategoryOption[] }>('/api/categories')
}
