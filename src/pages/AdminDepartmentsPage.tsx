import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { listDepartmentsAdmin, updateDepartmentHeadEmail, type AdminDepartment } from '../api/admin'
import { ApiError } from '../api/client'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

function DepartmentRow({ department, onSaved }: { department: AdminDepartment; onSaved: (d: AdminDepartment) => void }) {
  const [headEmail, setHeadEmail] = useState(department.headEmail ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const dirty = headEmail.trim() !== (department.headEmail ?? '')

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const { department: updated } = await updateDepartmentHeadEmail(department.id, headEmail.trim() || null)
      onSaved(updated)
      setMessage({ type: 'success', text: 'Saved.' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof ApiError ? err.message : 'Could not save.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 sm:w-48 sm:shrink-0">
        <p className="font-medium text-slate-800 dark:text-slate-200">{department.name}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="email"
          value={headEmail}
          onChange={(e) => setHeadEmail(e.target.value)}
          placeholder="head@dalmiacement.com"
          className={inputClass}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          className="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {message && (
        <span className={`text-xs ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {message.text}
        </span>
      )}
    </li>
  )
}

export default function AdminDepartmentsPage() {
  const { user: currentUser } = useAuth()
  const [departments, setDepartments] = useState<AdminDepartment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.role !== 'Super Admin') return
    listDepartmentsAdmin()
      .then(({ departments }) => setDepartments(departments))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load departments.'))
      .finally(() => setIsLoading(false))
  }, [currentUser])

  if (currentUser && currentUser.role !== 'Super Admin') {
    return <Navigate to="/admin" replace />
  }

  const handleSaved = (updated: AdminDepartment) => {
    setDepartments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Departments</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Set each department head's email so grievances redirected to that department notify them directly. Only Super
          Admins can change this.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Department Head Emails</h2>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {departments.map((d) => (
            <DepartmentRow key={d.id} department={d} onSaved={handleSaved} />
          ))}
          {!isLoading && departments.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No departments yet.</li>
          )}
        </ul>
      </div>
    </motion.div>
  )
}
