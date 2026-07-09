import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useGrievances } from '../context/GrievanceContext'
import { formatDate } from '../utils/format'

export default function ProfilePage() {
  const { employee } = useAuth()
  const { grievances } = useGrievances()

  if (!employee) return null

  const initials = employee.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  const fields = [
    { label: 'Employee Code', value: employee.employeeCode },
    { label: 'Department', value: employee.department },
    { label: 'Designation', value: employee.designation },
    { label: 'Unit / Location', value: employee.unitLocation },
    { label: 'Reporting Manager', value: employee.reportingManager },
    { label: 'Email', value: employee.email },
    { label: 'Joined On', value: formatDate(employee.joinedOn) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white"
          style={{ backgroundColor: employee.avatarColor }}
        >
          {initials}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{employee.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{employee.designation}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Employee Details</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs text-slate-400 dark:text-slate-500">{field.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Grievance Summary</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          You have submitted <span className="font-medium text-slate-800 dark:text-slate-200">{grievances.length}</span> grievance
          {grievances.length === 1 ? '' : 's'} in total.
        </p>
      </div>
    </motion.div>
  )
}
