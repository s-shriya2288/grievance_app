import { prisma } from './db.js'
import { AppError } from './errors.js'

export async function listDepartmentsWithHeadEmail() {
  const departments = await prisma.department.findMany({ orderBy: { departmentName: 'asc' } })
  return departments.map((d) => ({ id: d.id, name: d.departmentName, headEmail: d.headEmail }))
}

export async function updateDepartmentHeadEmail(departmentId: string, headEmail: string | null) {
  const department = await prisma.department.findUnique({ where: { id: departmentId } })
  if (!department) throw new AppError('Department not found.', 404)

  const updated = await prisma.department.update({ where: { id: departmentId }, data: { headEmail } })
  return { id: updated.id, name: updated.departmentName, headEmail: updated.headEmail }
}
