import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useGrievances } from '../context/GrievanceContext'
import { StatusBadge } from '../components/StatusBadge'
import CategoryChip from '../components/CategoryChip'
import Logo from '../components/Logo'
import { timeAgo } from '../utils/format'
import type { Grievance } from '../types'

const accentClasses = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  orange: 'bg-accent-orange-light text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  green: 'bg-accent-green-light text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
} as const

const accentIcons = { brand: '📋', orange: '⏳', green: '✅', rose: '⚠️' } as const

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

interface StatDef {
  label: string
  accent: keyof typeof accentClasses
  filter: (g: Grievance) => boolean
}

const statDefs: StatDef[] = [
  { label: 'Total Grievances', accent: 'brand', filter: () => true },
  { label: 'Open / In Progress', accent: 'orange', filter: (g) => g.status === 'Open' || g.status === 'In Progress' },
  { label: 'Resolved / Closed', accent: 'green', filter: (g) => g.status === 'Resolved' || g.status === 'Closed' },
  { label: 'Critical / High Priority', accent: 'rose', filter: (g) => g.priority === 'Critical' || g.priority === 'High' },
]

export default function DashboardPage() {
  const { employee } = useAuth()
  const { grievances } = useGrievances()
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const stats = useMemo(
    () => statDefs.map((def) => ({ ...def, value: grievances.filter(def.filter).length })),
    [grievances],
  )

  const selectedStat = stats.find((s) => s.label === selectedLabel) ?? null
  const selectedGrievances = useMemo(
    () => (selectedStat ? grievances.filter(selectedStat.filter) : []),
    [grievances, selectedStat],
  )

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div
        variants={item}
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <Logo size="md" />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">Dalmia Cement (Bharat) Limited</p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">Rajgangpur Plant</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">Employee Grievance Management Portal</p>
        </div>
      </motion.div>

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
        {stats.map((stat) => {
          const isSelected = selectedLabel === stat.label
          return (
            <button
              key={stat.label}
              type="button"
              onClick={() => setSelectedLabel(isSelected ? null : stat.label)}
              className={`rounded-xl border bg-white p-5 text-left transition-colors dark:bg-slate-900 ${
                isSelected
                  ? 'border-brand-400 ring-2 ring-brand-100 dark:border-brand-500 dark:ring-brand-500/20'
                  : 'border-slate-200 hover:border-brand-200 dark:border-slate-800 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${accentClasses[stat.accent]}`}>
                  {accentIcons[stat.accent]}
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </button>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {selectedStat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{selectedStat.label}</h2>
              <button
                type="button"
                onClick={() => setSelectedLabel(null)}
                className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                Close ✕
              </button>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {selectedGrievances.map((grievance) => (
                <li key={grievance.id}>
                  <Link
                    to={`/grievances/${grievance.id}`}
                    className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800 dark:text-slate-200">{grievance.subject}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <CategoryChip category={grievance.category} />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {grievance.id} · {timeAgo(grievance.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={grievance.status} />
                  </Link>
                </li>
              ))}
              {selectedGrievances.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No matching grievances.</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <CategoryChip category={grievance.category} />
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {grievance.id} · {timeAgo(grievance.updatedAt)}
                    </span>
                  </div>
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
