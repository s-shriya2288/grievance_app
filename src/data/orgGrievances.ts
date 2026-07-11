import type { Grievance, GrievanceCategory, GrievancePriority, GrievanceStatus } from '../types'
import { GRIEVANCE_SUBCATEGORIES } from '../types'

interface OrgSeed {
  id: string
  employeeName: string
  employeeId: string
  department: string
  unitLocation: string
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

  return {
    id: seed.id,
    employeeId: seed.employeeId,
    employeeName: seed.employeeName,
    department: seed.department,
    unitLocation: seed.unitLocation,
    reportingManager: 'N/A',
    category: seed.category,
    subCategory,
    subject: `${subCategory} concern raised by ${seed.employeeName.split(' ')[0]}`,
    description: `Reported issue related to ${seed.category.toLowerCase()} at ${seed.unitLocation}.`,
    dateOfIncident: '',
    personsInvolved: '',
    attachments: [],
    isConfidential: false,
    preferredResolution: '',
    priority: seed.priority,
    aiPriorityReasoning: '',
    status: seed.status,
    assignedTo: 'HR Business Partner',
    resolutionRemarks: isResolvedOrClosed ? 'Reviewed and addressed by the relevant team.' : '',
    employeeFeedback: '',
    closureRating: null,
    createdAt,
    updatedAt,
    timeline,
  }
}

const seeds: OrgSeed[] = [
  // Dalmiapuram Unit — largest plant, heaviest volume
  { id: 'ORG-2001', employeeName: 'Ravi Kumar', employeeId: 'DPM-2101', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Safety, Health & Environment (SHE)', priority: 'Critical', status: 'Resolved', daysAgoCreated: 12, daysToResolve: 2 },
  { id: 'ORG-2002', employeeName: 'Suresh Babu', employeeId: 'DPM-2102', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Attendance & Leave', priority: 'Low', status: 'Closed', daysAgoCreated: 40, daysToResolve: 6 },
  { id: 'ORG-2003', employeeName: 'Lakshmi Narayan', employeeId: 'DPM-2103', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Payroll', priority: 'High', status: 'Closed', daysAgoCreated: 55, daysToResolve: 9 },
  { id: 'ORG-2004', employeeName: 'Muthu Kumar', employeeId: 'DPM-2104', department: 'Quality Assurance', unitLocation: 'Dalmiapuram Unit', category: 'HR Policies', priority: 'Medium', status: 'Resolved', daysAgoCreated: 18, daysToResolve: 7 },
  { id: 'ORG-2005', employeeName: 'Karthik Raja', employeeId: 'DPM-2105', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Facilities & Administration', priority: 'Medium', status: 'Closed', daysAgoCreated: 60, daysToResolve: 10 },
  { id: 'ORG-2006', employeeName: 'Deepa Rani', employeeId: 'DPM-2106', department: 'Human Resources', unitLocation: 'Dalmiapuram Unit', category: 'Employee Relations', priority: 'High', status: 'In Progress', daysAgoCreated: 5 },
  { id: 'ORG-2007', employeeName: 'Manikandan S', employeeId: 'DPM-2107', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Compensation & Benefits', priority: 'Medium', status: 'Resolved', daysAgoCreated: 22, daysToResolve: 8 },
  { id: 'ORG-2008', employeeName: 'Priya Dharshini', employeeId: 'DPM-2108', department: 'Safety & Environment', unitLocation: 'Dalmiapuram Unit', category: 'Safety, Health & Environment (SHE)', priority: 'Critical', status: 'Closed', daysAgoCreated: 70, daysToResolve: 1 },
  { id: 'ORG-2009', employeeName: 'Arun Prakash', employeeId: 'DPM-2109', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Attendance & Leave', priority: 'Low', status: 'Open', daysAgoCreated: 2 },
  { id: 'ORG-2010', employeeName: 'Kavitha Suresh', employeeId: 'DPM-2110', department: 'IT', unitLocation: 'Dalmiapuram Unit', category: 'IT & HR Systems', priority: 'Low', status: 'Resolved', daysAgoCreated: 15, daysToResolve: 3 },
  { id: 'ORG-2011', employeeName: 'Bala Subramanian', employeeId: 'DPM-2111', department: 'Production', unitLocation: 'Dalmiapuram Unit', category: 'Suggestion / Improvement', priority: 'Low', status: 'Closed', daysAgoCreated: 80, daysToResolve: 19 },
  { id: 'ORG-2012', employeeName: 'Meena Kumari', employeeId: 'DPM-2112', department: 'Finance & Accounts', unitLocation: 'Dalmiapuram Unit', category: 'Payroll', priority: 'Medium', status: 'In Progress', daysAgoCreated: 4 },

  // Kadapa Unit
  { id: 'ORG-2013', employeeName: 'Venkatesh Reddy', employeeId: 'KDP-2201', department: 'Production', unitLocation: 'Kadapa Unit', category: 'Safety, Health & Environment (SHE)', priority: 'High', status: 'Resolved', daysAgoCreated: 25, daysToResolve: 4 },
  { id: 'ORG-2014', employeeName: 'Anitha Reddy', employeeId: 'KDP-2202', department: 'Human Resources', unitLocation: 'Kadapa Unit', category: 'HR Policies', priority: 'Low', status: 'Closed', daysAgoCreated: 45, daysToResolve: 5 },
  { id: 'ORG-2015', employeeName: 'Srinivasa Rao', employeeId: 'KDP-2203', department: 'Production', unitLocation: 'Kadapa Unit', category: 'Compensation & Benefits', priority: 'Medium', status: 'Resolved', daysAgoCreated: 30, daysToResolve: 11 },
  { id: 'ORG-2016', employeeName: 'Padma Vathi', employeeId: 'KDP-2204', department: 'Quality Assurance', unitLocation: 'Kadapa Unit', category: 'Employee Relations', priority: 'High', status: 'Open', daysAgoCreated: 3 },
  { id: 'ORG-2017', employeeName: 'Ramesh Chandra', employeeId: 'KDP-2205', department: 'Supply Chain', unitLocation: 'Kadapa Unit', category: 'Facilities & Administration', priority: 'Medium', status: 'Closed', daysAgoCreated: 65, daysToResolve: 8 },
  { id: 'ORG-2018', employeeName: 'Swathi Reddy', employeeId: 'KDP-2206', department: 'Production', unitLocation: 'Kadapa Unit', category: 'Attendance & Leave', priority: 'Low', status: 'In Progress', daysAgoCreated: 6 },
  { id: 'ORG-2019', employeeName: 'Naga Raju', employeeId: 'KDP-2207', department: 'Safety & Environment', unitLocation: 'Kadapa Unit', category: 'Safety, Health & Environment (SHE)', priority: 'Critical', status: 'Resolved', daysAgoCreated: 10, daysToResolve: 1 },
  { id: 'ORG-2020', employeeName: 'Divya Prasanna', employeeId: 'KDP-2208', department: 'IT', unitLocation: 'Kadapa Unit', category: 'IT & HR Systems', priority: 'Medium', status: 'Closed', daysAgoCreated: 50, daysToResolve: 6 },

  // Rajgangpur Unit
  { id: 'ORG-2021', employeeName: 'Bikram Nayak', employeeId: 'RJG-2301', department: 'Production', unitLocation: 'Rajgangpur Unit', category: 'Payroll', priority: 'High', status: 'Resolved', daysAgoCreated: 28, daysToResolve: 12 },
  { id: 'ORG-2022', employeeName: 'Sunita Behera', employeeId: 'RJG-2302', department: 'Human Resources', unitLocation: 'Rajgangpur Unit', category: 'Harassment & Misconduct', priority: 'Critical', status: 'Closed', daysAgoCreated: 35, daysToResolve: 3 },
  { id: 'ORG-2023', employeeName: 'Debasish Patra', employeeId: 'RJG-2303', department: 'Production', unitLocation: 'Rajgangpur Unit', category: 'Medical & Insurance', priority: 'Medium', status: 'Resolved', daysAgoCreated: 20, daysToResolve: 9 },
  { id: 'ORG-2024', employeeName: 'Jyoti Ranjan', employeeId: 'RJG-2304', department: 'Quality Assurance', unitLocation: 'Rajgangpur Unit', category: 'Welfare & Engagement', priority: 'Low', status: 'Open', daysAgoCreated: 7 },
  { id: 'ORG-2025', employeeName: 'Manoj Sahoo', employeeId: 'RJG-2305', department: 'Safety & Environment', unitLocation: 'Rajgangpur Unit', category: 'Safety, Health & Environment (SHE)', priority: 'High', status: 'Closed', daysAgoCreated: 58, daysToResolve: 5 },
  { id: 'ORG-2026', employeeName: 'Pallavi Mishra', employeeId: 'RJG-2306', department: 'Production', unitLocation: 'Rajgangpur Unit', category: 'Attendance & Leave', priority: 'Low', status: 'Resolved', daysAgoCreated: 16, daysToResolve: 4 },

  // Belgaum Unit
  { id: 'ORG-2027', employeeName: 'Anand Desai', employeeId: 'BLG-2401', department: 'Production', unitLocation: 'Belgaum Unit', category: 'Compensation & Benefits', priority: 'Medium', status: 'Closed', daysAgoCreated: 42, daysToResolve: 7 },
  { id: 'ORG-2028', employeeName: 'Shalini Patil', employeeId: 'BLG-2402', department: 'Human Resources', unitLocation: 'Belgaum Unit', category: 'Career & Development', priority: 'Low', status: 'Resolved', daysAgoCreated: 24, daysToResolve: 13 },
  { id: 'ORG-2029', employeeName: 'Vijay Kulkarni', employeeId: 'BLG-2403', department: 'Supply Chain', unitLocation: 'Belgaum Unit', category: 'Facilities & Administration', priority: 'Medium', status: 'In Progress', daysAgoCreated: 8 },
  { id: 'ORG-2030', employeeName: 'Rohini Joshi', employeeId: 'BLG-2404', department: 'Quality Assurance', unitLocation: 'Belgaum Unit', category: 'Performance Management', priority: 'Medium', status: 'Closed', daysAgoCreated: 63, daysToResolve: 14 },
  { id: 'ORG-2031', employeeName: 'Ganesh Hegde', employeeId: 'BLG-2405', department: 'Production', unitLocation: 'Belgaum Unit', category: 'Safety, Health & Environment (SHE)', priority: 'High', status: 'Resolved', daysAgoCreated: 19, daysToResolve: 2 },

  // Corporate Office - Gurugram
  { id: 'ORG-2032', employeeName: 'Aditi Sharma', employeeId: 'COG-2501', department: 'Product Engineering', unitLocation: 'Corporate Office - Gurugram', category: 'Performance Management', priority: 'Medium', status: 'Resolved', daysAgoCreated: 14, daysToResolve: 6 },
  { id: 'ORG-2033', employeeName: 'Rahul Mehta', employeeId: 'COG-2502', department: 'Finance & Accounts', unitLocation: 'Corporate Office - Gurugram', category: 'Payroll', priority: 'High', status: 'Closed', daysAgoCreated: 48, daysToResolve: 8 },
  { id: 'ORG-2034', employeeName: 'Neha Kapoor', employeeId: 'COG-2503', department: 'Sales & Marketing', unitLocation: 'Corporate Office - Gurugram', category: 'Compliance & Ethics', priority: 'Critical', status: 'Closed', daysAgoCreated: 33, daysToResolve: 4 },
  { id: 'ORG-2035', employeeName: 'Vikram Singh', employeeId: 'COG-2504', department: 'Human Resources', unitLocation: 'Corporate Office - Gurugram', category: 'Recruitment & Onboarding', priority: 'Low', status: 'Open', daysAgoCreated: 1 },
  { id: 'ORG-2036', employeeName: 'Pooja Verma', employeeId: 'COG-2505', department: 'IT', unitLocation: 'Corporate Office - Gurugram', category: 'IT & HR Systems', priority: 'Medium', status: 'Resolved', daysAgoCreated: 21, daysToResolve: 5 },
]

export const orgWideGrievances: Grievance[] = seeds.map(makeGrievance)
