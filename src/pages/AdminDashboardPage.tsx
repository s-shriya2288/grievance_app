import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import CategoryChip from '../components/CategoryChip'
import BarList from '../components/BarList'
import { averageResolutionByGroup, averageResolutionDays, countBy } from '../utils/analytics'
import { downloadCsv, toCsv } from '../utils/csvExport'
import { formatDate } from '../utils/format'
import type { Grievance, GrievancePriority, GrievanceStatus } from '../types/api'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

function formatDays(days: number | null) {
  if (days === null) return '—'
  if (days < 1) return `${Math.round(days * 24)} hrs`
  return `${days.toFixed(1)} days`
}

const statusFilters: Array<GrievanceStatus | 'All'> = ['All', 'Open', 'InProgress', 'Resolved', 'Closed']
const statusLabels: Record<GrievanceStatus | 'All', string> = {
  All: 'All',
  Open: 'Open',
  InProgress: 'In Progress',
  Resolved: 'Resolved',
  Closed: 'Closed',
}

const priorityFilters: Array<GrievancePriority | 'All'> = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function AdminDashboardPage() {
  const { grievances, isLoading, error } = useGrievances()
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<GrievancePriority | 'All'>('All')
  const [search, setSearch] = useState('')

  const byDepartment = useMemo(() => countBy(grievances, (g) => g.department.departmentName), [grievances])
  const overallAvgResolution = useMemo(() => averageResolutionDays(grievances), [grievances])
  const resolutionByDepartment = useMemo(
    () => averageResolutionByGroup(grievances, (g) => g.department.departmentName),
    [grievances],
  )
  const openCount = useMemo(
    () => grievances.filter((g) => g.status === 'Open' || g.status === 'InProgress').length,
    [grievances],
  )

  const topDepartment = byDepartment[0]

  const stats = [
    { label: 'Total Grievances', value: grievances.length, accent: 'brand' as const },
    { label: 'Open / In Progress', value: openCount, accent: 'orange' as const },
    { label: 'Avg. Life of a Complaint', value: formatDays(overallAvgResolution), accent: 'green' as const },
    {
      label: 'Top Department',
      value: topDepartment?.label ?? '—',
      sub: topDepartment ? `${topDepartment.count} complaints` : undefined,
      accent: 'sky' as const,
    },
  ]

  const accentClasses = {
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
    orange: 'bg-accent-orange-light text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    green: 'bg-accent-green-light text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  }

  const accentIcons = { brand: '📋', orange: '⏳', green: '⏱', sky: '🏆' }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return grievances.filter((g) => {
      if (statusFilter !== 'All' && g.status !== statusFilter) return false
      if (priorityFilter !== 'All' && g.priority !== priorityFilter) return false
      if (q && !`${g.ticketNumber} ${g.subject} ${g.employee.firstName} ${g.employee.lastName}`.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [grievances, statusFilter, priorityFilter, search])

  const handleExport = () => {
    const headers = [
      'Ticket Number',
      'Subject',
      'Category',
      'Sub-category',
      'Department',
      'Employee',
      'Employee ID',
      'Priority',
      'Status',
      'Submitted',
      'Resolved',
      'Assigned To',
    ]
    const rows: string[][] = filtered.map((g: Grievance) => [
      g.ticketNumber,
      g.subject,
      g.category.categoryName,
      g.subcategory.subcategoryName,
      g.department.departmentName,
      `${g.employee.firstName} ${g.employee.lastName}`,
      g.employee.employeeId,
      g.priority,
      g.status,
      formatDate(g.createdAt),
      g.resolvedAt ? formatDate(g.resolvedAt) : '',
      g.assignedAdmin ? `${g.assignedAdmin.firstName} ${g.assignedAdmin.lastName}` : '',
    ])
    downloadCsv(`grievances-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(headers, rows))
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">HR Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Rajgangpur Unit — where grievances come from and how long they take to resolve.
        </p>
      </motion.div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${accentClasses[stat.accent]}`}>
                {accentIcons[stat.accent]}
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
            {stat.sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{stat.sub}</p>}
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Complaints by Department (Area)</h2>
        <BarList items={byDepartment} />
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Average Resolution Time by Department</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            How long a complaint stays open, on average, before being marked Resolved.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400 dark:text-slate-500">
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Total Complaints</th>
                <th className="px-6 py-3 font-medium">Avg. Resolution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {resolutionByDepartment.map((row) => (
                <tr key={row.label}>
                  <td className="px-6 py-3 font-medium text-slate-800 dark:text-slate-200">{row.label}</td>
                  <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{row.count}</td>
                  <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{formatDays(row.avgResolutionDays)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Grievance Queue</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket, subject, employee…"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20 sm:w-64"
            />
            <button
              type="button"
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ⬇ Export to Excel
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-6 pt-4">
          {statusFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
          <span className="mx-1 w-px bg-slate-200 dark:bg-slate-800" />
          {priorityFilters.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                priorityFilter === p
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((grievance) => (
            <li key={grievance.id}>
              <Link
                to={`/grievances/${grievance.id}`}
                className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryChip category={grievance.category.categoryName} />
                    <span className="text-xs text-slate-400 dark:text-slate-500">{grievance.ticketNumber}</span>
                  </div>
                  <p className="mt-1 truncate font-medium text-slate-800 dark:text-slate-200">{grievance.subject}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {grievance.employee.firstName} {grievance.employee.lastName} ({grievance.employee.employeeId})
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">Submitted {formatDate(grievance.createdAt)}</span>
                    <PriorityBadge priority={grievance.priority} />
                  </div>
                </div>
                <StatusBadge status={grievance.status} />
              </Link>
            </li>
          ))}
          {!isLoading && filtered.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No grievances match this filter.</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  )
}
