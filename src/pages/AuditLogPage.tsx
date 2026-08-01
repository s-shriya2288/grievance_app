import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useAdminData } from '../context/AdminDataContext'
import { formatDateTime } from '../utils/format'

export default function AuditLogPage() {
  const { user } = useAuth()
  const { auditLogs, isLoading, error } = useAdminData()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return auditLogs
    return auditLogs.filter((log) =>
      `${log.action} ${log.entity} ${log.entityId ?? ''} ${log.user ? `${log.user.firstName} ${log.user.lastName} ${log.user.employeeId}` : ''}`
        .toLowerCase()
        .includes(q),
    )
  }, [auditLogs, search])

  if (user && user.role !== 'Super Admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Audit Log</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The most recent 200 sensitive actions taken across the portal.
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by action, entity, or user…"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20 sm:w-72"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <th className="px-5 py-3 font-medium">Timestamp</th>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Entity</th>
              <th className="px-5 py-3 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap px-5 py-3 text-slate-500 dark:text-slate-400">{formatDateTime(log.timestamp)}</td>
                <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">
                  {log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.employeeId})` : 'System'}
                </td>
                <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{log.action}</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                  {log.entity}
                  {log.entityId && <span className="text-xs text-slate-400 dark:text-slate-500"> · {log.entityId}</span>}
                </td>
                <td className="px-5 py-3 text-slate-400 dark:text-slate-500">{log.ipAddress ?? '—'}</td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                  No audit log entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
