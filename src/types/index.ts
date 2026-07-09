export interface Employee {
  id: string
  name: string
  email: string
  department: string
  designation: string
  employeeCode: string
  joinedOn: string
  avatarColor: string
}

export type GrievanceStatus = 'Submitted' | 'In Review' | 'Resolved' | 'Rejected'

export type GrievancePriority = 'Low' | 'Medium' | 'High'

export type GrievanceCategory =
  | 'Workplace Conduct'
  | 'Compensation & Benefits'
  | 'Work Environment'
  | 'Policy Violation'
  | 'Harassment'
  | 'Other'

export interface GrievanceEvent {
  status: GrievanceStatus
  note: string
  timestamp: string
}

export interface Grievance {
  id: string
  subject: string
  description: string
  category: GrievanceCategory
  priority: GrievancePriority
  status: GrievanceStatus
  createdAt: string
  updatedAt: string
  isAnonymous: boolean
  timeline: GrievanceEvent[]
}
