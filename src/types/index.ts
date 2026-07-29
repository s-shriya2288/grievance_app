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

export const DEPARTMENTS = [
  'HR',
  'Housing',
  'IT',
  'Administration',
  'Security',
  'Transport',
  'Finance',
  'Medical',
  'Safety',
  'Electrical',
  'Mechanical',
  'Civil',
  'Purchase',
] as const

export type Department = (typeof DEPARTMENTS)[number]

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
  'Housing / Quarters',
  'Security',
  'Transport',
  'Electrical',
  'Mechanical',
  'Civil',
  'Purchase',
  'Others',
] as const

export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number]

export const CATEGORY_DEPARTMENT_MAP: Record<GrievanceCategory, Department> = {
  'Compensation & Benefits': 'Finance',
  'Attendance & Leave': 'HR',
  Payroll: 'Finance',
  'Employee Relations': 'HR',
  'Harassment & Misconduct': 'HR',
  'Performance Management': 'HR',
  'Career & Development': 'HR',
  'Recruitment & Onboarding': 'HR',
  'HR Policies': 'HR',
  'Facilities & Administration': 'Administration',
  'IT & HR Systems': 'IT',
  'Medical & Insurance': 'Medical',
  'Safety, Health & Environment (SHE)': 'Safety',
  'Welfare & Engagement': 'HR',
  'Compliance & Ethics': 'HR',
  'Separation & Exit': 'HR',
  'Suggestion / Improvement': 'Administration',
  'Housing / Quarters': 'Housing',
  Security: 'Security',
  Transport: 'Transport',
  Electrical: 'Electrical',
  Mechanical: 'Mechanical',
  Civil: 'Civil',
  Purchase: 'Purchase',
  Others: 'Administration',
}

export function getRoutedDepartment(category: GrievanceCategory): Department {
  return CATEGORY_DEPARTMENT_MAP[category] ?? 'Administration'
}

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
    'Other',
  ],
  'Attendance & Leave': [
    'Leave balance',
    'Attendance correction',
    'Shift issues',
    'Overtime',
    'Holiday working',
    'Other',
  ],
  Payroll: ['Salary credit', 'Tax deduction', 'Payslip', 'Arrears', 'Recovery', 'Final settlement', 'Other'],
  'Employee Relations': [
    'Workplace disputes',
    'Unfair treatment',
    'Conflict with colleagues/supervisors',
    'Other',
  ],
  'Harassment & Misconduct': ['Sexual harassment', 'Bullying', 'Discrimination', 'Intimidation', 'Misconduct', 'Other'],
  'Performance Management': ['PMS', 'KRA', 'Goal setting', 'Appraisal concerns', 'Ratings', 'Other'],
  'Career & Development': [
    'Promotion',
    'Transfer',
    'Internal Job Posting (IJP)',
    'Training',
    'Learning opportunities',
    'Other',
  ],
  'Recruitment & Onboarding': ['Joining formalities', 'Documentation', 'Induction', 'Probation', 'Other'],
  'HR Policies': ['Policy clarification', 'Code of conduct', 'Service rules', 'Other'],
  'Facilities & Administration': [
    'Transport',
    'Canteen',
    'Housekeeping',
    'Security',
    'Accommodation',
    'Guest house',
    'Uniforms',
    'Other',
  ],
  'IT & HR Systems': ['HRMS login', 'ESS issues', 'Attendance system', 'Portal access', 'Laptop', 'Software', 'Network', 'Other'],
  'Medical & Insurance': ['Health insurance', 'Medical reimbursement', 'Network hospitals', 'Health check-ups', 'Other'],
  'Safety, Health & Environment (SHE)': ['Safety concerns', 'PPE', 'Unsafe conditions', 'Occupational health', 'Other'],
  'Welfare & Engagement': [
    'Employee welfare schemes',
    'Events',
    'Recreation',
    'Employee engagement activities',
    'Other',
  ],
  'Compliance & Ethics': [
    'Ethics violations',
    'Corruption',
    'Fraud',
    'Conflict of interest',
    'Whistleblower concerns',
    'Other',
  ],
  'Separation & Exit': [
    'Resignation',
    'Notice period',
    'Relieving letter',
    'Experience letter',
    'F&F settlement',
    'Other',
  ],
  'Suggestion / Improvement': [
    'Process improvement ideas',
    'Policy suggestions',
    'Workplace improvements',
    'Other',
  ],
  'Housing / Quarters': ['Quarters allotment', 'Quarters maintenance', 'Water supply', 'Electricity in quarters', 'Other'],
  Security: ['Gate pass issues', 'ID card', 'Vehicle entry', 'Theft / loss report', 'Other'],
  Transport: ['Bus service', 'Route timing', 'Vehicle condition', 'Transport allowance', 'Other'],
  Electrical: ['Power outage', 'Wiring issue', 'Equipment fault', 'Other'],
  Mechanical: ['Machinery breakdown', 'Equipment maintenance', 'Tool / spare parts', 'Other'],
  Civil: ['Building repair', 'Road / drainage', 'Construction issue', 'Other'],
  Purchase: ['Procurement delay', 'Vendor issue', 'Material quality', 'Other'],
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
  routedDepartment: Department
  assignedTo: string
  resolutionRemarks: string
  employeeFeedback: string
  closureRating: number | null

  createdAt: string
  updatedAt: string
  timeline: GrievanceEvent[]
}
