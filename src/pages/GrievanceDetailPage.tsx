import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import { formatDateTime } from '../utils/format'

export default function GrievanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getGrievance } = useGrievances()
  const grievance = id ? getGrievance(id) : undefined

  if (!grievance) {
    return <Navigate to="/grievances" replace />
  }

  return (
    <div className="space-y-6">
      <Link to="/grievances" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Back to My Grievances
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs text-slate-400">{grievance.id} · {grievance.category}</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">{grievance.subject}</h1>
          </div>
          <StatusBadge status={grievance.status} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <PriorityBadge priority={grievance.priority} />
          <span className="text-xs text-slate-400">Submitted {formatDateTime(grievance.createdAt)}</span>
          {grievance.isAnonymous && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              Submitted anonymously
            </span>
          )}
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{grievance.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="rounded-xl border border-slate-200 bg-white p-6"
      >
        <h2 className="mb-5 font-semibold text-slate-900">Status Timeline</h2>
        <ol className="space-y-6">
          {grievance.timeline.map((event, index) => (
            <li key={index} className="relative flex gap-4 pl-1">
              <div className="flex flex-col items-center">
                <span className="z-10 flex h-3 w-3 shrink-0 rounded-full bg-brand-600" />
                {index < grievance.timeline.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-slate-200" style={{ minHeight: 32 }} />
                )}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={event.status} />
                  <span className="text-xs text-slate-400">{formatDateTime(event.timestamp)}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-600">{event.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  )
}
