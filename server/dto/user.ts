import type { Prisma } from '../../generated/prisma/client.js'

type UserWithRelations = Prisma.UserGetPayload<{ include: { role: true; department: true } }>

export interface UserDto {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  department: { id: string; name: string }
  role: string
  plant: string
  profilePhoto: string | null
  accountStatus: string
  createdAt: string
  lastLogin: string | null
}

export function toUserDto(user: UserWithRelations): UserDto {
  return {
    id: user.id,
    employeeId: user.employeeId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    department: { id: user.department.id, name: user.department.departmentName },
    role: user.role.roleName,
    plant: user.plant,
    profilePhoto: user.profilePhoto,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt.toISOString(),
    lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
  }
}
