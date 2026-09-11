import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import Logo from '../Logo'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂', color: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300' },
  { to: '/grievances', label: 'My Grievances', icon: '☰', color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300' },
  {
    to: '/grievances/new',
    label: 'Submit Grievance',
    icon: '✎',
    color: 'bg-accent-orange-light text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: '◍',
    color: 'bg-accent-green-light text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
      <div className="flex h-16 items-center gap-2 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 px-6 dark:from-brand-900 dark:via-brand-900 dark:to-slate-900">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm">
          <Logo size="sm" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-white">Dalmia Rajgangpur</p>
          <p className="truncate text-xs text-brand-100/80">Grievance Portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-brand-50 dark:bg-brand-500/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md text-sm ${item.color}`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Dalmia Cement (Bharat) Limited
        <br />
        Rajgangpur Plant
      </div>
    </aside>
  )
}
