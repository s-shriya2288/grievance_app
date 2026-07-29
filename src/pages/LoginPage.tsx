import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('jordan.lee@company.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-brand-900/40">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-green/20 blur-3xl dark:bg-accent-green/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent-orange/20 blur-3xl dark:bg-accent-orange/10" />
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo size="lg" />
            <h1 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Dalmia Cement (Bharat) Limited
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Rajgangpur Plant</p>
            <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-400">
              Employee Grievance Management Portal
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20"
              placeholder="Enter any password"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-rose-600 dark:text-rose-400"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Demo portal — any email &amp; password will sign you in.
        </p>
          <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
            HR Admin?{' '}
            <Link to="/admin/login" className="font-medium text-accent-orange hover:underline">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
