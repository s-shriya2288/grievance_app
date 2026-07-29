import type { Grievance, GrievanceCategory, GrievancePriority, GrievanceStatus } from '../types'
import { getRoutedDepartment, GRIEVANCE_SUBCATEGORIES } from '../types'

const UNIT = 'Rajgangpur Unit'

interface OrgSeed {
  id: string
  employeeName: string
  employeeId: string
  department: string
  category: GrievanceCategory
  priority: GrievancePriority
  status: GrievanceStatus
  daysAgoCreated: number
  daysToResolve?: number
}

const now = Date.now()
const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

function buildTimeline(status: GrievanceStatus, createdAt: string, daysToResolve?: number) {
  const timeline: Grievance['timeline'] = [
    { status: 'Open', note: 'Grievance submitted by employee.', timestamp: createdAt },
  ]
  const createdMs = new Date(createdAt).getTime()
  let updatedAt = createdAt

  if (status === 'Open') return { timeline, updatedAt }

  const inProgressAt = new Date(createdMs + 1 * 24 * 60 * 60 * 1000).toISOString()
  timeline.push({ status: 'In Progress', note: 'Assigned to the relevant team for review.', timestamp: inProgressAt })
  updatedAt = inProgressAt
  if (status === 'In Progress') return { timeline, updatedAt }

  const resolveDays = daysToResolve ?? 5
  const resolvedAt = new Date(createdMs + resolveDays * 24 * 60 * 60 * 1000).toISOString()
  timeline.push({ status: 'Resolved', note: 'Issue reviewed and resolved.', timestamp: resolvedAt })
  updatedAt = resolvedAt
  if (status === 'Resolved') return { timeline, updatedAt }

  const closedAt = new Date(new Date(resolvedAt).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString()
  timeline.push({ status: 'Closed', note: 'Employee confirmed resolution and closed the grievance.', timestamp: closedAt })
  updatedAt = closedAt
  return { timeline, updatedAt }
}

function makeGrievance(seed: OrgSeed): Grievance {
  const createdAt = daysAgo(seed.daysAgoCreated)
  const { timeline, updatedAt } = buildTimeline(seed.status, createdAt, seed.daysToResolve)
  const subCategory = GRIEVANCE_SUBCATEGORIES[seed.category][0]
  const isResolvedOrClosed = seed.status === 'Resolved' || seed.status === 'Closed'
  const routedDepartment = getRoutedDepartment(seed.category)

  return {
    id: seed.id,
    employeeId: seed.employeeId,
    employeeName: seed.employeeName,
    department: seed.department,
    unitLocation: UNIT,
    reportingManager: 'N/A',
    category: seed.category,
    subCategory,
    subject: `${subCategory} concern raised by ${seed.employeeName.split(' ')[0]}`,
    description: `Reported issue related to ${seed.category.toLowerCase()} at ${UNIT}.`,
    dateOfIncident: '',
    personsInvolved: '',
    attachments: [],
    isConfidential: false,
    preferredResolution: '',
    priority: seed.priority,
    aiPriorityReasoning: '',
    status: seed.status,
    routedDepartment,
    assignedTo: `${routedDepartment} Department`,
    resolutionRemarks: isResolvedOrClosed ? 'Reviewed and addressed by the relevant team.' : '',
    employeeFeedback: '',
    closureRating: null,
    createdAt,
    updatedAt,
    timeline,
  }
}

const seeds: OrgSeed[] = [
  // Production — largest department on the plant floor
  { id: 'ORG-3001', employeeName: 'Bikram Nayak', employeeId: 'RJG-3101', department: 'Production', category: 'Safety, Health & Environment (SHE)', priority: 'Critical', status: 'Resolved', daysAgoCreated: 12, daysToResolve: 2 },
  { id: 'ORG-3002', employeeName: 'Sunita Behera', employeeId: 'RJG-3102', department: 'Production', category: 'Attendance & Leave', priority: 'Low', status: 'Closed', daysAgoCreated: 40, daysToResolve: 6 },
  { id: 'ORG-3003', employeeName: 'Debasish Patra', employeeId: 'RJG-3103', department: 'Production', category: 'Payroll', priority: 'High', status: 'Closed', daysAgoCreated: 55, daysToResolve: 9 },
  { id: 'ORG-3004', employeeName: 'Jyoti Ranjan', employeeId: 'RJG-3104', department: 'Production', category: 'Compensation & Benefits', priority: 'Medium', status: 'Resolved', daysAgoCreated: 22, daysToResolve: 8 },
  { id: 'ORG-3005', employeeName: 'Manoj Sahoo', employeeId: 'RJG-3105', department: 'Production', category: 'Facilities & Administration', priority: 'Medium', status: 'Closed', daysAgoCreated: 60, daysToResolve: 10 },
  { id: 'ORG-3006', employeeName: 'Pallavi Mishra', employeeId: 'RJG-3106', department: 'Production', category: 'Attendance & Leave', priority: 'Low', status: 'Open', daysAgoCreated: 2 },
  { id: 'ORG-3007', employeeName: 'Rajesh Pradhan', employeeId: 'RJG-3107', department: 'Production', category: 'Suggestion / Improvement', priority: 'Low', status: 'Closed', daysAgoCreated: 80, daysToResolve: 19 },
  { id: 'ORG-3008', employeeName: 'Ashok Bhoi', employeeId: 'RJG-3108', department: 'Production', category: 'Employee Relations', priority: 'High', status: 'In Progress', daysAgoCreated: 5 },

  // Maintenance & Engineering
  { id: 'ORG-3009', employeeName: 'Bibhuti Bhusan', employeeId: 'RJG-3201', department: 'Maintenance & Engineering', category: 'Safety, Health & Environment (SHE)', priority: 'Critical', status: 'Closed', daysAgoCreated: 70, daysToResolve: 1 },
  { id: 'ORG-3010', employeeName: 'Prasant Kumar Sahu', employeeId: 'RJG-3202', department: 'Maintenance & Engineering', category: 'IT & HR Systems', priority: 'Low', status: 'Resolved', daysAgoCreated: 15, daysToResolve: 3 },
  { id: 'ORG-3011', employeeName: 'Ranjan Kumar Nayak', employeeId: 'RJG-3203', department: 'Maintenance & Engineering', category: 'Performance Management', priority: 'Medium', status: 'In Progress', daysAgoCreated: 4 },
  { id: 'ORG-3012', employeeName: 'Satyabrata Jena', employeeId: 'RJG-3204', department: 'Maintenance & Engineering', category: 'Facilities & Administration', priority: 'Medium', status: 'Closed', daysAgoCreated: 48, daysToResolve: 8 },

  // Quality Assurance
  { id: 'ORG-3013', employeeName: 'Padma Vathi', employeeId: 'RJG-3301', department: 'Quality Assurance', category: 'HR Policies', priority: 'Medium', status: 'Resolved', daysAgoCreated: 18, daysToResolve: 7 },
  { id: 'ORG-3014', employeeName: 'Srinivasa Rao', employeeId: 'RJG-3302', department: 'Quality Assurance', category: 'Employee Relations', priority: 'High', status: 'Open', daysAgoCreated: 3 },
  { id: 'ORG-3015', employeeName: 'Rohini Joshi', employeeId: 'RJG-3303', department: 'Quality Assurance', category: 'Performance Management', priority: 'Medium', status: 'Closed', daysAgoCreated: 63, daysToResolve: 14 },
  { id: 'ORG-3016', employeeName: 'Ganesh Hegde', employeeId: 'RJG-3304', department: 'Quality Assurance', category: 'Welfare & Engagement', priority: 'Low', status: 'Resolved', daysAgoCreated: 16, daysToResolve: 4 },

  // Human Resources
  { id: 'ORG-3017', employeeName: 'Anitha Reddy', employeeId: 'RJG-3401', department: 'Human Resources', category: 'Harassment & Misconduct', priority: 'Critical', status: 'Closed', daysAgoCreated: 35, daysToResolve: 3 },
  { id: 'ORG-3018', employeeName: 'Deepa Rani', employeeId: 'RJG-3402', department: 'Human Resources', category: 'Career & Development', priority: 'Low', status: 'Resolved', daysAgoCreated: 24, daysToResolve: 13 },
  { id: 'ORG-3019', employeeName: 'Vikram Singh', employeeId: 'RJG-3403', department: 'Human Resources', category: 'Recruitment & Onboarding', priority: 'Low', status: 'Open', daysAgoCreated: 1 },
  { id: 'ORG-3020', employeeName: 'Shalini Patil', employeeId: 'RJG-3404', department: 'Human Resources', category: 'Compliance & Ethics', priority: 'Critical', status: 'Closed', daysAgoCreated: 33, daysToResolve: 4 },

  // Safety & Environment
  { id: 'ORG-3021', employeeName: 'Naga Raju', employeeId: 'RJG-3501', department: 'Safety & Environment', category: 'Safety, Health & Environment (SHE)', priority: 'Critical', status: 'Resolved', daysAgoCreated: 10, daysToResolve: 1 },
  { id: 'ORG-3022', employeeName: 'Venkatesh Reddy', employeeId: 'RJG-3502', department: 'Safety & Environment', category: 'Safety, Health & Environment (SHE)', priority: 'High', status: 'Resolved', daysAgoCreated: 25, daysToResolve: 4 },
  { id: 'ORG-3023', employeeName: 'Anand Desai', employeeId: 'RJG-3503', department: 'Safety & Environment', category: 'Medical & Insurance', priority: 'Medium', status: 'Closed', daysAgoCreated: 42, daysToResolve: 7 },

  // Finance & Accounts
  { id: 'ORG-3024', employeeName: 'Rahul Mehta', employeeId: 'RJG-3601', department: 'Finance & Accounts', category: 'Payroll', priority: 'High', status: 'Closed', daysAgoCreated: 48, daysToResolve: 8 },
  { id: 'ORG-3025', employeeName: 'Meena Kumari', employeeId: 'RJG-3602', department: 'Finance & Accounts', category: 'Payroll', priority: 'Medium', status: 'In Progress', daysAgoCreated: 4 },
  { id: 'ORG-3026', employeeName: 'Neha Kapoor', employeeId: 'RJG-3603', department: 'Finance & Accounts', category: 'Separation & Exit', priority: 'Medium', status: 'Resolved', daysAgoCreated: 20, daysToResolve: 9 },

  // Supply Chain
  { id: 'ORG-3027', employeeName: 'Ramesh Chandra', employeeId: 'RJG-3701', department: 'Supply Chain', category: 'Facilities & Administration', priority: 'Medium', status: 'Closed', daysAgoCreated: 65, daysToResolve: 8 },
  { id: 'ORG-3028', employeeName: 'Vijay Kulkarni', employeeId: 'RJG-3702', department: 'Supply Chain', category: 'Facilities & Administration', priority: 'Medium', status: 'In Progress', daysAgoCreated: 8 },

  // IT
  { id: 'ORG-3029', employeeName: 'Divya Prasanna', employeeId: 'RJG-3801', department: 'IT', category: 'IT & HR Systems', priority: 'Medium', status: 'Closed', daysAgoCreated: 50, daysToResolve: 6 },
  { id: 'ORG-3030', employeeName: 'Pooja Verma', employeeId: 'RJG-3802', department: 'IT', category: 'IT & HR Systems', priority: 'Low', status: 'Resolved', daysAgoCreated: 21, daysToResolve: 5 },
]

export const orgWideGrievances: Grievance[] = seeds.map(makeGrievance)
