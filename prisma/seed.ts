import { prisma } from '../server/db.js'
import { hashPassword } from '../server/auth/password.js'
import {
  DEPARTMENTS,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_SUBCATEGORIES,
  CATEGORY_DEPARTMENT_MAP,
} from '../shared/taxonomy.js'

const ROLES = ['Employee', 'Department Admin', 'Super Admin'] as const

const MAIN_ADMIN_EMPLOYEE_ID = 'employee_admin'
const MAIN_ADMIN_PASSWORD = '12345678'

async function main() {
  console.log('Seeding departments...')
  const departmentIdByName = new Map<string, string>()
  for (const name of DEPARTMENTS) {
    const department = await prisma.department.upsert({
      where: { departmentName: name },
      update: {},
      create: { departmentName: name },
    })
    departmentIdByName.set(name, department.id)
  }

  console.log('Seeding roles...')
  for (const roleName of ROLES) {
    await prisma.role.upsert({
      where: { roleName },
      update: {},
      create: { roleName },
    })
  }

  console.log('Seeding grievance categories & sub-categories...')
  for (const categoryName of GRIEVANCE_CATEGORIES) {
    const departmentName = CATEGORY_DEPARTMENT_MAP[categoryName]
    const departmentId = departmentIdByName.get(departmentName)
    if (!departmentId) {
      throw new Error(`No seeded department found for "${departmentName}" (category "${categoryName}")`)
    }

    const category = await prisma.grievanceCategory.upsert({
      where: { departmentId_categoryName: { departmentId, categoryName } },
      update: {},
      create: { departmentId, categoryName },
    })

    for (const subcategoryName of GRIEVANCE_SUBCATEGORIES[categoryName]) {
      await prisma.grievanceSubcategory.upsert({
        where: { categoryId_subcategoryName: { categoryId: category.id, subcategoryName } },
        update: {},
        create: { categoryId: category.id, subcategoryName },
      })
    }
  }

  console.log('Seeding main admin account...')
  const existingMainAdmin = await prisma.user.findUnique({ where: { employeeId: MAIN_ADMIN_EMPLOYEE_ID } })
  if (!existingMainAdmin) {
    const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { roleName: 'Super Admin' } })
    const administrationDeptId = departmentIdByName.get('Administration')
    if (!administrationDeptId) throw new Error('Administration department was not seeded.')

    await prisma.user.create({
      data: {
        employeeId: MAIN_ADMIN_EMPLOYEE_ID,
        firstName: 'Main',
        lastName: 'Admin',
        email: 'admin@dalmiabharat.com',
        passwordHash: await hashPassword(MAIN_ADMIN_PASSWORD),
        departmentId: administrationDeptId,
        roleId: superAdminRole.id,
      },
    })
    console.log(`Created main admin "${MAIN_ADMIN_EMPLOYEE_ID}" — change this password after first login.`)
  }

  console.log(
    `Seed complete: ${departmentIdByName.size} departments, ${ROLES.length} roles, ${GRIEVANCE_CATEGORIES.length} categories.`,
  )
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
