export interface Employee {
  id: string
  name: string
  email: string
  department: string
  designation: string
  employeeCode: string
  unitLocation: string
  reportingManager: string
  joinedOn: string
  avatarColor: string
}

export type GrievanceStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'

export type GrievancePriority = 'Low' | 'Medium' | 'High' | 'Critical'

export const GRIEVANCE_CATEGORIES = [
  'Compensation & Benefits',
  'Attendance & Leave',
  'Payroll',
  'Employee Relations',
  'Harassment & Misconduct',
  'Performance Management',
  'Career & Development',
  'Recruitment & Onboarding',
  'HR Policies',
  'Facilities & Administration',
  'IT & HR Systems',
  'Medical & Insurance',
  'Safety, Health & Environment (SHE)',
  'Welfare & Engagement',
  'Compliance & Ethics',
  'Separation & Exit',
  'Suggestion / Improvement',
  'Others',
] as const

export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number]

export const GRIEVANCE_SUBCATEGORIES: Record<GrievanceCategory, string[]> = {
  'Compensation & Benefits': [
    'Salary',
    'Incentives',
    'Bonus',
    'Reimbursement',
    'Allowances',
    'PF',
    'Gratuity',
    'ESIC',
    'Insurance',
  ],
  'Attendance & Leave': [
    'Leave balance',
    'Attendance correction',
    'Shift issues',
    'Overtime',
    'Holiday working',
  ],
  Payroll: ['Salary credit', 'Tax deduction', 'Payslip', 'Arrears', 'Recovery', 'Final settlement'],
  'Employee Relations': [
    'Workplace disputes',
    'Unfair treatment',
    'Conflict with colleagues/supervisors',
  ],
  'Harassment & Misconduct': ['Sexual harassment', 'Bullying', 'Discrimination', 'Intimidation', 'Misconduct'],
  'Performance Management': ['PMS', 'KRA', 'Goal setting', 'Appraisal concerns', 'Ratings'],
  'Career & Development': [
    'Promotion',
    'Transfer',
    'Internal Job Posting (IJP)',
    'Training',
    'Learning opportunities',
  ],
  'Recruitment & Onboarding': ['Joining formalities', 'Documentation', 'Induction', 'Probation'],
  'HR Policies': ['Policy clarification', 'Code of conduct', 'Service rules'],
  'Facilities & Administration': [
    'Transport',
    'Canteen',
    'Housekeeping',
    'Security',
    'Accommodation',
    'Guest house',
    'Uniforms',
  ],
  'IT & HR Systems': ['HRMS login', 'ESS issues', 'Attendance system', 'Portal access'],
  'Medical & Insurance': ['Health insurance', 'Medical reimbursement', 'Network hospitals', 'Health check-ups'],
  'Safety, Health & Environment (SHE)': ['Safety concerns', 'PPE', 'Unsafe conditions', 'Occupational health'],
  'Welfare & Engagement': [
    'Employee welfare schemes',
    'Events',
    'Recreation',
    'Employee engagement activities',
  ],
  'Compliance & Ethics': [
    'Ethics violations',
    'Corruption',
    'Fraud',
    'Conflict of interest',
    'Whistleblower concerns',
  ],
  'Separation & Exit': [
    'Resignation',
    'Notice period',
    'Relieving letter',
    'Experience letter',
    'F&F settlement',
  ],
  'Suggestion / Improvement': [
    'Process improvement ideas',
    'Policy suggestions',
    'Workplace improvements',
  ],
  Others: ['Not covered above'],
}

export interface GrievanceEvent {
  status: GrievanceStatus
  note: string
  timestamp: string
}

export interface GrievanceAttachment {
  name: string
  size: number
}

export interface Grievance {
  id: string

  // Employee context (auto-filled from the submitter's profile)
  employeeId: string
  employeeName: string
  department: string
  unitLocation: string
  reportingManager: string

  // Classification
  category: GrievanceCategory
  subCategory: string
  subject: string
  description: string
  dateOfIncident: string
  personsInvolved: string
  attachments: GrievanceAttachment[]
  isConfidential: boolean
  preferredResolution: string

  // AI-assigned priority
  priority: GrievancePriority
  aiPriorityReasoning: string

  // Workflow / resolution
  status: GrievanceStatus
  assignedTo: string
  resolutionRemarks: string
  employeeFeedback: string
  closureRating: number | null

  createdAt: string
  updatedAt: string
  timeline: GrievanceEvent[]
}
