import type { GrievancePriority, GrievanceStatus } from '../types'

const statusStyles: Record<GrievanceStatus, string> = {
  Open: 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Progress': 'bg-accent-orange-light text-amber-800 ring-amber-200',
  Resolved: 'bg-accent-green-light text-emerald-800 ring-emerald-200',
  Closed: 'bg-brand-50 text-brand-700 ring-brand-100',
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
  High: 'text-accent-orange',
  Critical: 'text-rose-600',
}

export function PriorityBadge({ priority }: { priority: GrievancePriority }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[priority]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {priority} priority
    </span>
  )
}
