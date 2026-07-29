import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import CategoryChip from '../components/CategoryChip'
import { formatDate } from '../utils/format'
import type { GrievanceStatus } from '../types/api'

const filters: Array<GrievanceStatus | 'All'> = ['All', 'Open', 'InProgress', 'Resolved', 'Closed']
const filterLabels: Record<GrievanceStatus | 'All', string> = {
  All: 'All',
  Open: 'Open',
  InProgress: 'In Progress',
  Resolved: 'Resolved',
  Closed: 'Closed',
}

export default function GrievancesListPage() {
  const { grievances, isLoading, error } = useGrievances()
  const [activeFilter, setActiveFilter] = useState<GrievanceStatus | 'All'>('All')

  const filtered = useMemo(
    () => (activeFilter === 'All' ? grievances : grievances.filter((g) => g.status === activeFilter)),
    [grievances, activeFilter],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">My Grievances</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track the status of grievances you've submitted.</p>
        </div>
        <Link
          to="/grievances/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          + Submit New Grievance
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            {filterLabels[filter]}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((grievance, index) => (
          <motion.div
            key={grievance.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Link
              to={`/grievances/${grievance.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-200 hover:bg-brand-50/30 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryChip category={grievance.category.categoryName} />
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {grievance.ticketNumber} · {grievance.subcategory.subcategoryName}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">{grievance.subject}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{grievance.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <PriorityBadge priority={grievance.priority} />
                    <span className="text-xs text-slate-400 dark:text-slate-500">Submitted {formatDate(grievance.createdAt)}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Assigned to {grievance.assignedAdmin ? `${grievance.assignedAdmin.firstName} ${grievance.assignedAdmin.lastName}` : `${grievance.department.departmentName} Department`}
                    </span>
                  </div>
                </div>
                <StatusBadge status={grievance.status} />
              </div>
            </Link>
          </motion.div>
        ))}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">No grievances match this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
