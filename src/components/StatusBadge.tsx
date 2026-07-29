import type { GrievancePriority, GrievanceStatus } from '../types/api'

const statusStyles: Record<GrievanceStatus, string> = {
  Open: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  InProgress:
    'bg-accent-orange-light text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
  Resolved:
    'bg-accent-green-light text-emerald-800 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  Closed: 'bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/30',
}

const statusLabels: Record<GrievanceStatus, string> = {
  Open: 'Open',
  InProgress: 'In Progress',
  Resolved: 'Resolved',
  Closed: 'Closed',
}

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

const priorityStyles: Record<GrievancePriority, string> = {
  Low: 'text-slate-500 dark:text-slate-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  High: 'text-accent-orange dark:text-orange-400',
  Critical: 'text-rose-600 dark:text-rose-400',
}

export function PriorityBadge({ priority }: { priority: GrievancePriority }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[priority]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {priority} priority
    </span>
  )
}
