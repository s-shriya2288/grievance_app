import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const { employee, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = employee?.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          EP
        </div>
      </div>
      <div className="hidden text-sm text-slate-500 md:block">
        Welcome back, <span className="font-medium text-slate-800">{employee?.name}</span>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm hover:bg-slate-50"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: employee?.avatarColor }}
          >
            {initials}
          </span>
          <span className="hidden font-medium text-slate-700 sm:inline">{employee?.name}</span>
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
                className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/profile')
                  }}
                  className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  Log out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
