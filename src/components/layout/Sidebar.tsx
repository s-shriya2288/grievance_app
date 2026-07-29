import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import Logo from '../Logo'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/grievances', label: 'My Grievances', icon: '☰' },
  { to: '/grievances/new', label: 'Submit Grievance', icon: '✎' },
  { to: '/profile', label: 'Profile', icon: '◍' },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <Logo size="sm" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">Dalmia Rajgangpur</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">Grievance Portal</p>
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
                <span className="relative z-10 w-5 text-center">{item.icon}</span>
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
