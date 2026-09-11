import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { verifyEmail, resendVerification } from '../api/auth'
import { ApiError } from '../api/client'
import Footer from '../components/Footer'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { email?: string; devOtp?: string } | null

  const [email, setEmail] = useState(state?.email ?? '')
  const [otp, setOtp] = useState('')
  const [devOtp, setDevOtp] = useState(state?.devOtp)
  const [error, setError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await verifyEmail(email.trim(), otp.trim())
      setDone(true)
      setTimeout(() => navigate('/login', { state: { registered: true } }), 1500)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setResendMessage(null)
    setResending(true)
    try {
      const result = await resendVerification(email.trim())
      setDevOtp(result.devOtp)
      setResendMessage('A new code has been sent to your email.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend the code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-brand-900/40">
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <img src="/brand/dalmia-icon.png" alt="Dalmia Bharat" className="h-14 w-14" />
            <h1 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Verify Your Email</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter the 6-digit code we emailed you to activate your account.
            </p>
          </div>

          {devOtp && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              No email provider configured — your dev code is <strong>{devOtp}</strong>.
            </p>
          )}

          {done ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              Email verified. Redirecting to sign in…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Company email
                </label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  6-digit code
                </label>
                <input
                  id="otp"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={`${inputClass} tracking-[0.3em]`}
                  placeholder="000000"
                />
              </div>

              {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
              {resendMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{resendMessage}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Verifying…' : 'Verify Email'}
              </motion.button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !email.trim()}
                className="w-full text-center text-sm font-medium text-brand-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-brand-400"
              >
                {resending ? 'Resending…' : "Didn't get a code? Resend"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Back to sign in
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
