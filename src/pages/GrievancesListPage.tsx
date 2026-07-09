import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import { formatDate } from '../utils/format'
import type { GrievanceStatus } from '../types'

const filters: Array<GrievanceStatus | 'All'> = ['All', 'Open', 'In Progress', 'Resolved', 'Closed']

export default function GrievancesListPage() {
  const { grievances, reprioritizeAll, isReprioritizing } = useGrievances()
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => reprioritizeAll()}
            disabled={isReprioritizing}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
          >
            {isReprioritizing ? 'Re-analyzing…' : '↻ Re-run AI Prioritization'}
          </button>
          <Link
            to="/grievances/new"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            + Submit New Grievance
          </Link>
        </div>
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
            {filter}
          </button>
        ))}
      </div>

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
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>{grievance.id}</span>
                    <span>·</span>
                    <span>{grievance.category}</span>
                    <span>·</span>
                    <span>{grievance.subCategory}</span>
                  </div>
                  <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{grievance.subject}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{grievance.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <PriorityBadge priority={grievance.priority} />
                    <span className="text-xs text-slate-400 dark:text-slate-500">Submitted {formatDate(grievance.createdAt)}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">Assigned to {grievance.assignedTo}</span>
                  </div>
                </div>
                <StatusBadge status={grievance.status} />
              </div>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">No grievances match this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
