export type GrievanceStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed'
export type GrievancePriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface UserProfile {
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

export interface DepartmentOption {
  id: string
  name: string
}

export interface CategoryOption {
  id: string
  name: string
  departmentId: string
  departmentName: string
  subcategories: { id: string; name: string }[]
}

export interface GrievanceComment {
  id: string
  comment: string
  createdAt: string
  user: { id: string; firstName: string; lastName: string }
}

export interface Satisfaction {
  id: string
  rating: number
  feedback: string | null
  createdAt: string
}

export interface Grievance {
  id: string
  ticketNumber: string
  employeeId: string
  departmentId: string
  categoryId: string
  subcategoryId: string
  assignedAdminId: string | null
  subject: string
  description: string
  dateOfIncident: string | null
  personsInvolved: string | null
  isConfidential: boolean
  preferredResolution: string | null
  aiPriorityReasoning: string | null
  priority: GrievancePriority
  attachment: string | null
  status: GrievanceStatus
  resolution: string | null
  reopenCount: number
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
  employee: { id: string; firstName: string; lastName: string; employeeId: string; email: string }
  assignedAdmin: { id: string; firstName: string; lastName: string } | null
  department: { id: string; departmentName: string }
  category: { id: string; categoryName: string }
  subcategory: { id: string; subcategoryName: string }
  comments: GrievanceComment[]
  satisfaction: Satisfaction | null
}

export type NotificationType =
  | 'TicketSubmitted'
  | 'Assigned'
  | 'StatusChanged'
  | 'ReminderSent'
  | 'Resolved'
  | 'Reopened'
  | 'Closed'

export interface AppNotification {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}
