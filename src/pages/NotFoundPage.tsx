import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center dark:bg-slate-950">
      <p className="text-5xl font-bold text-brand-600 dark:text-brand-400">404</p>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist.</p>
      <Link
        to="/dashboard"
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
