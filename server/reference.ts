import { prisma } from './db.js'

export async function listDepartments() {
  const departments = await prisma.department.findMany({ orderBy: { departmentName: 'asc' } })
  return departments.map((d) => ({ id: d.id, name: d.departmentName }))
}

export async function listCategories() {
  const categories = await prisma.grievanceCategory.findMany({
    include: { subcategories: { orderBy: { subcategoryName: 'asc' } }, department: true },
    orderBy: { categoryName: 'asc' },
  })
  return categories.map((c) => ({
    id: c.id,
    name: c.categoryName,
    departmentId: c.departmentId,
    departmentName: c.department.departmentName,
    subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.subcategoryName })),
  }))
}
