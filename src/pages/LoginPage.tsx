import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../api/client'

const ADMIN_ROLES = ['Department Admin', 'Super Admin']

const inputClass =
  'w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-3.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

function CareHeartIcon() {
  return (
    <svg viewBox="0 0 96 84" className="h-16 w-18" aria-hidden="true">
      <path
        d="M48 80C24 62 6 47 6 28.5 6 15 16.5 5 29 5c8 0 15 4.2 19 11 4-6.8 11-11 19-11 12.5 0 23 10 23 23.5C90 47 72 62 48 80Z"
        fill="none"
        stroke="var(--color-brand-600)"
        strokeWidth="3.5"
      />
      <circle cx="35" cy="34" r="8" fill="var(--color-accent-green)" />
      <circle cx="61" cy="34" r="8" fill="var(--color-accent-orange)" />
      <circle cx="48" cy="28" r="9" fill="var(--color-brand-600)" />
      <path d="M20 56c2-9 8-14 15-14s13 5 15 14" fill="none" stroke="var(--color-accent-green)" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 56c2-9 8-14 15-14s13 5 15 14" fill="none" stroke="var(--color-accent-orange)" strokeWidth="4" strokeLinecap="round" />
      <path d="M33 50c2-8 7-12 13-12s11 4 13 12" fill="none" stroke="var(--color-brand-600)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export default function LoginPage() {
  const { isAuthenticated, user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const justRegistered = Boolean((location.state as { registered?: boolean } | null)?.registered)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={user && ADMIN_ROLES.includes(user.role) ? '/admin' : '/dashboard'} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const loggedInUser = await login(identifier, password, rememberMe)
      navigate(ADMIN_ROLES.includes(loggedInUser.role) ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-brand-900/40">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent-green/20 blur-3xl dark:bg-accent-green/10" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-accent-orange/20 blur-3xl dark:bg-accent-orange/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/10" />

      <div className="flex flex-1 items-start justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/95 p-8 shadow-2xl shadow-brand-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none"
        >
          <div className="mb-2 flex items-start justify-between">
            <span />
            <img src="/brand/dalmia-logo-full.png" alt="Dalmia Bharat" className="h-auto w-36" />
          </div>

          <div className="flex flex-col items-center text-center">
            <CareHeartIcon />
            <h1 className="mt-2 text-3xl leading-none font-extrabold text-brand-700 dark:text-brand-300">
              HR{' '}
              <span
                style={{ fontFamily: 'var(--font-script)' }}
                className="bg-gradient-to-r from-accent-green via-brand-600 to-accent-orange bg-clip-text text-4xl text-transparent"
              >
                We care
              </span>{' '}
              @RGP
            </h1>
            <div className="mt-3 flex w-full items-center gap-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-accent-orange">♥</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500 italic dark:text-slate-400">
              Your Voice. Our Commitment. Better Together.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Rajgangpur Plant</p>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Employee Grievance Management Portal</p>
          </div>

          {justRegistered && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              Registration successful — sign in with your new account.
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Employee ID or company email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-base">👤</span>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputClass}
                  placeholder="ENG-1042 or you@dalmiabharat.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-base">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-16`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                Forgot password?
              </Link>
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
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/30 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <motion.span
                  className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                />
              ) : (
                <span>👤➜</span>
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </motion.button>
          </form>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-50/70 px-4 py-3.5 dark:bg-brand-500/10">
            <span className="text-2xl">🎧</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">We are here for you.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Raise your concern with confidence. We ensure timely action and resolution.
              </p>
            </div>
            <span className="text-xl text-accent-green">✅</span>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 text-center text-xs dark:divide-slate-700">
            <Link to="/register" className="flex flex-col items-center gap-1 px-1 text-accent-green hover:underline">
              <span className="text-lg">👥</span>
              <span>
                New employee?
                <br />
                <span className="font-semibold">Register here</span>
              </span>
            </Link>
            <Link to="/admin/login" className="flex flex-col items-center gap-1 px-1 text-accent-orange hover:underline">
              <span className="text-lg">🛡️</span>
              <span>
                HR Admin?
                <br />
                <span className="font-semibold">Sign in here</span>
              </span>
            </Link>
            <Link to="/download" className="flex flex-col items-center gap-1 px-1 text-brand-600 hover:underline dark:text-brand-400">
              <span className="text-lg">📱</span>
              <span>
                Get the
                <br />
                <span className="font-semibold">Android app</span>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 bg-brand-700 py-4 text-white dark:bg-brand-900">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-4 text-center text-xs font-medium sm:grid-cols-4 sm:text-sm">
          <span className="flex items-center justify-center gap-1.5">👥 People First</span>
          <span className="flex items-center justify-center gap-1.5">⚖️ Integrity Always</span>
          <span className="flex items-center justify-center gap-1.5">🤝 Respect Every Voice</span>
          <span className="flex items-center justify-center gap-1.5">💪 Stronger Together</span>
        </div>
      </div>
      <div className="relative z-10 bg-emerald-50 py-2 text-center dark:bg-emerald-500/10">
        <p style={{ fontFamily: 'var(--font-script)' }} className="text-lg text-brand-700 dark:text-brand-300">
          We care for people. We care for RGP. 🌿
        </p>
      </div>
    </div>
  )
}
