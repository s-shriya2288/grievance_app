import { useMemo } from 'react'
import { motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import { orgWideGrievances } from '../data/orgGrievances'
import { averageResolutionByGroup, averageResolutionDays, countBy } from '../utils/analytics'
import BarList from '../components/BarList'

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

export default function InsightsPage() {
  const { grievances } = useGrievances()

  const allGrievances = useMemo(() => [...grievances, ...orgWideGrievances], [grievances])

  const byUnit = useMemo(() => countBy(allGrievances, (g) => g.unitLocation), [allGrievances])
  const byDepartment = useMemo(() => countBy(allGrievances, (g) => g.department), [allGrievances])
  const overallAvgResolution = useMemo(() => averageResolutionDays(allGrievances), [allGrievances])
  const resolutionByUnit = useMemo(() => averageResolutionByGroup(allGrievances, (g) => g.unitLocation), [allGrievances])

  const topUnit = byUnit[0]
  const topDepartment = byDepartment[0]

  const stats = [
    { label: 'Total Grievances (org-wide)', value: allGrievances.length },
    { label: 'Avg. Life of a Complaint', value: formatDays(overallAvgResolution) },
    { label: 'Top Area', value: topUnit?.label ?? '—', sub: topUnit ? `${topUnit.count} complaints` : undefined },
    { label: 'Top Department', value: topDepartment?.label ?? '—', sub: topDepartment ? `${topDepartment.count} complaints` : undefined },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Insights</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Org-wide view of where grievances come from and how long they take to resolve.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
            {stat.sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{stat.sub}</p>}
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Complaints by Unit / Location</h2>
          <BarList items={byUnit} unit="complaints" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Complaints by Department</h2>
          <BarList items={byDepartment} unit="complaints" />
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Average Resolution Time by Area</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            How long a complaint stays open, on average, before being marked Resolved.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400 dark:text-slate-500">
                <th className="px-6 py-3 font-medium">Area</th>
                <th className="px-6 py-3 font-medium">Total Complaints</th>
                <th className="px-6 py-3 font-medium">Avg. Resolution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {resolutionByUnit.map((row) => (
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
    </motion.div>
  )
}
