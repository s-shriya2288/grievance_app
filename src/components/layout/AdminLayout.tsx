import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { AdminDataProvider } from '../../context/AdminDataContext'
import Logo from '../Logo'
import Footer from '../Footer'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
          <Logo size="sm" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">HR Admin Portal</p>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">Dalmia Rajgangpur</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-orange-700 dark:text-orange-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-accent-orange-light dark:bg-orange-500/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 w-5 text-center">▦</span>
                <span className="relative z-10">Dashboard</span>
              </>
            )}
          </NavLink>
          {user?.role === 'Super Admin' && (
            <NavLink
              to="/admin/audit-logs"
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-accent-orange-light dark:bg-orange-500/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 w-5 text-center">🕘</span>
                  <span className="relative z-10">Audit Log</span>
                </>
              )}
            </NavLink>
          )}
          {user?.role === 'Super Admin' && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-accent-orange-light dark:bg-orange-500/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 w-5 text-center">🛡️</span>
                  <span className="relative z-10">Manage Admins</span>
                </>
              )}
            </NavLink>
          )}
        </nav>
        <div className="border-t border-slate-200 p-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Dalmia Cement (Bharat) Limited
          <br />
          Rajgangpur Plant
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <Logo size="sm" />
          </div>
          <div className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {user?.firstName} {user?.lastName}
            </span>{' '}
            · {user?.role}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-base leading-none"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </motion.span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <AdminDataProvider>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </AdminDataProvider>
          <Footer />
        </main>
      </div>
    </div>
  )
}
