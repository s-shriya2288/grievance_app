import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useGrievances } from '../context/GrievanceContext'
import { StatusBadge } from '../components/StatusBadge'
import { timeAgo } from '../utils/format'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { employee } = useAuth()
  const { grievances } = useGrievances()

  const open = grievances.filter((g) => g.status === 'Open' || g.status === 'In Progress').length
  const closedOut = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length
  const criticalOrHigh = grievances.filter((g) => g.priority === 'Critical' || g.priority === 'High').length

  const stats = [
    { label: 'Total Grievances', value: grievances.length },
    { label: 'Open / In Progress', value: open },
    { label: 'Resolved / Closed', value: closedOut },
    { label: 'Critical / High Priority', value: criticalOrHigh },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Hi {employee?.name.split(' ')[0]}, welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your grievances.</p>
        </div>
        <Link
          to="/grievances/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          + Submit New Grievance
        </Link>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent Grievances</h2>
          <Link to="/grievances" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {grievances.slice(0, 5).map((grievance) => (
            <li key={grievance.id}>
              <Link
                to={`/grievances/${grievance.id}`}
                className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800 dark:text-slate-200">{grievance.subject}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {grievance.id} · {grievance.category} · {timeAgo(grievance.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={grievance.status} />
              </Link>
            </li>
          ))}
          {grievances.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No grievances submitted yet.</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  )
}
