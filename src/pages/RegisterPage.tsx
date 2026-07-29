import { type FormEvent, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { register as registerAccount } from '../api/auth'
import { fetchDepartments } from '../api/reference'
import { ApiError } from '../api/client'
import Footer from '../components/Footer'
import type { DepartmentOption } from '../types/api'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [employeeId, setEmployeeId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDepartments()
      .then(({ departments }) => {
        setDepartments(departments)
        if (departments[0]) setDepartmentId(departments[0].id)
      })
      .catch(() => setError('Could not load departments. Is the database connected?'))
  }, [])

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await registerAccount({
        employeeId: employeeId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        departmentId,
        password,
        confirmPassword,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-brand-900/40">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <img src="/brand/dalmia-icon.png" alt="Dalmia Bharat" className="h-14 w-14" />
            <h1 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Employee Registration</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Rajgangpur Plant Grievance Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="employeeId" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Employee ID
                </label>
                <input id="employeeId" required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputClass} placeholder="ENG-1042" />
              </div>
              <div>
                <label htmlFor="department" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Department
                </label>
                <select id="department" required value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className={inputClass}>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  First Name
                </label>
                <input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Last Name
                </label>
                <input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Company Email
              </label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@dalmiabharat.com" />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mobile Number <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
              </label>
              <input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.
            </p>

            {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

            <motion.button
              type="submit"
              disabled={loading || !departmentId}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Register'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
