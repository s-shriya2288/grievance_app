import { type FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useAdminData } from '../context/AdminDataContext'
import { createAdminUser, type CreateAdminInput } from '../api/admin'
import { ApiError } from '../api/client'
import { formatDate } from '../utils/format'
import type { DepartmentOption, UserProfile } from '../types/api'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

function CreateAdminForm({ departments, onCreated }: { departments: DepartmentOption[]; onCreated: (u: UserProfile) => void }) {
  const [employeeId, setEmployeeId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? '')
  const [role, setRole] = useState<CreateAdminInput['role']>('Department Admin')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const { user } = await createAdminUser({
        employeeId: employeeId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        departmentId,
        role,
        password,
      })
      onCreated(user)
      setMessage({ type: 'success', text: `${user.firstName} ${user.lastName} created as ${role}.` })
      setEmployeeId('')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhoneNumber('')
      setPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof ApiError ? err.message : 'Could not create admin.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Create a New Admin</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Employee ID</label>
          <input required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputClass} placeholder="employee_admin2" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as CreateAdminInput['role'])} className={inputClass}>
            <option value="Department Admin">Department Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Company Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number (optional)</label>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
          <select required value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className={inputClass}>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.
      </p>

      {message && (
        <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !departmentId}
        className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Creating…' : 'Create Admin'}
      </button>
    </form>
  )
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const { admins, departments, isLoading, error, addAdmin } = useAdminData()

  if (currentUser && currentUser.role !== 'Super Admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage Admins</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create Department Admin or Super Admin accounts. Only Super Admins can do this.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      {departments.length > 0 && <CreateAdminForm departments={departments} onCreated={addAdmin} />}

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Existing Admins</h2>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {admins.map((admin) => (
            <li key={admin.id} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {admin.firstName} {admin.lastName}{' '}
                  <span className="text-xs font-normal text-slate-400 dark:text-slate-500">({admin.employeeId})</span>
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {admin.department.name} · {admin.email}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                  {admin.role}
                </span>
                <span>Since {formatDate(admin.createdAt)}</span>
              </div>
            </li>
          ))}
          {!isLoading && admins.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No admins yet.</li>
          )}
        </ul>
      </div>
    </motion.div>
  )
}
