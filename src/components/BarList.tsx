import { motion } from 'motion/react'
import type { CountEntry } from '../utils/analytics'

export default function BarList({ items, unit = 'complaints' }: { items: CountEntry[]; unit?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1)
  const singularUnit = unit.endsWith('s') ? unit.slice(0, -1) : unit

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={item.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
            <span className="text-slate-400 dark:text-slate-500">
              {item.count} {item.count === 1 ? singularUnit : unit}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / max) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
              className={`h-full rounded-full ${index === 0 ? 'bg-brand-600' : 'bg-brand-300 dark:bg-brand-500/50'}`}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
