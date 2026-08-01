import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth, ApiError } from '../context/AuthContext'
import { useGrievances } from '../context/GrievanceContext'
import { formatDate } from '../utils/format'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

function EditProfileForm() {
  const { user, updateProfile } = useAuth()
  const [employeeId, setEmployeeId] = useState(user?.employeeId ?? '')
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile({
        employeeId: employeeId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      })
      setMessage({ type: 'success', text: 'Profile updated.' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof ApiError ? err.message : 'Could not update profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Update Profile</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Employee ID (used to sign in)</label>
          <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number</label>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
        </div>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}

function ChangePasswordForm() {
  const { changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage(null)
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    setSaving(true)
    try {
      await changePassword(currentPassword, newPassword)
      setMessage({ type: 'success', text: 'Password changed successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof ApiError ? err.message : 'Could not change password.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Change Password</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
        </div>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { grievances } = useGrievances()
  const navigate = useNavigate()

  if (!user) return null

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  const fields = [
    { label: 'Employee ID', value: user.employeeId },
    { label: 'Department', value: user.department.name },
    { label: 'Role', value: user.role },
    { label: 'Plant', value: user.plant },
    { label: 'Company Email', value: user.email },
    { label: 'Mobile Number', value: user.phoneNumber ?? '—' },
    { label: 'Joined On', value: formatDate(user.createdAt) },
    { label: 'Last Login', value: user.lastLogin ? formatDate(user.lastLogin) : '—' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
              {initials}
            </span>
          )}
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.role}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-rose-200 px-3.5 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          Log out
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Employee Details</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs text-slate-400 dark:text-slate-500">{field.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <EditProfileForm />
      <ChangePasswordForm />

      {user.role === 'Employee' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Grievance Summary</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You have submitted <span className="font-medium text-slate-800 dark:text-slate-200">{grievances.length}</span> grievance
            {grievances.length === 1 ? '' : 's'} in total.
          </p>
        </div>
      )}
    </motion.div>
  )
}
