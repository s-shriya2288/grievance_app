import type { Employee, Grievance } from '../types'

export const demoEmployee: Employee = {
  id: 'emp-1001',
  name: 'Jordan Lee',
  email: 'jordan.lee@company.com',
  department: 'Product Engineering',
  designation: 'Senior Frontend Engineer',
  employeeCode: 'ENG-1042',
  joinedOn: '2022-03-14',
  avatarColor: '#6366f1',
}

const now = Date.now()
const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

export const seedGrievances: Grievance[] = [
  {
    id: 'GRV-1001',
    subject: 'Unpaid overtime for release weekend',
    description:
      'Worked through the weekend for the v3.2 release but overtime hours were not reflected in this month\'s payslip.',
    category: 'Compensation & Benefits',
    priority: 'High',
    status: 'In Review',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
    isAnonymous: false,
    timeline: [
      { status: 'Submitted', note: 'Grievance submitted by employee.', timestamp: daysAgo(6) },
      { status: 'In Review', note: 'Assigned to HR Payroll team for verification.', timestamp: daysAgo(3) },
    ],
  },
  {
    id: 'GRV-1002',
    subject: 'Air conditioning not working on 4th floor',
    description: 'The AC on the 4th floor engineering wing has been down for two weeks, making it hard to focus.',
    category: 'Work Environment',
    priority: 'Medium',
    status: 'Resolved',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(14),
    isAnonymous: false,
    timeline: [
      { status: 'Submitted', note: 'Grievance submitted by employee.', timestamp: daysAgo(20) },
      { status: 'In Review', note: 'Facilities team notified.', timestamp: daysAgo(18) },
      { status: 'Resolved', note: 'HVAC unit repaired and tested.', timestamp: daysAgo(14) },
    ],
  },
  {
    id: 'GRV-1003',
    subject: 'Request to review parking allocation policy',
    description: 'Parking spots are allocated on a first-come basis, which disadvantages employees with early school drop-offs.',
    category: 'Policy Violation',
    priority: 'Low',
    status: 'Submitted',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    isAnonymous: false,
    timeline: [{ status: 'Submitted', note: 'Grievance submitted by employee.', timestamp: daysAgo(1) }],
  },
]
