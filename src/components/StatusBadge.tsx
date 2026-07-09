import type { GrievancePriority, GrievanceStatus } from '../types'

const statusStyles: Record<GrievanceStatus, string> = {
  Submitted: 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Review': 'bg-amber-100 text-amber-800 ring-amber-200',
  Resolved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Rejected: 'bg-rose-100 text-rose-700 ring-rose-200',
}

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

const priorityStyles: Record<GrievancePriority, string> = {
  Low: 'text-slate-500',
  Medium: 'text-amber-600',
  High: 'text-rose-600',
}

export function PriorityBadge({ priority }: { priority: GrievancePriority }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[priority]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {priority} priority
    </span>
  )
}
