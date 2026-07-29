import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notifications'
import { timeAgo } from '../../utils/format'
import type { AppNotification } from '../../types/api'
import Logo from '../Logo'

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loaded, setLoaded] = useState(false)

  const load = () => {
    listNotifications()
      .then(({ notifications }) => setNotifications(notifications))
      .catch(() => setNotifications([]))
      .finally(() => setLoaded(true))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    try {
      await markNotificationRead(id)
    } catch {
      load()
    }
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    try {
      await markAllNotificationsRead()
    } catch {
      load()
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
                {notifications.slice(0, 10).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className="flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    >
                      {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{timeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  </li>
                ))}
                {loaded && notifications.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">No notifications yet.</li>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase().slice(0, 2) : ''

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <Logo size="sm" />
      </div>
      <div className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">
        Welcome back, <span className="font-medium text-slate-800 dark:text-slate-100">{user?.firstName} {user?.lastName}</span>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
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
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {initials}
              </span>
            )}
            <span className="hidden font-medium text-slate-700 dark:text-slate-200 sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/profile')
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    Log out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
