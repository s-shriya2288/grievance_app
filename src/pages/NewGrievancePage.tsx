import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import type { GrievanceCategory, GrievancePriority } from '../types'

const categories: GrievanceCategory[] = [
  'Workplace Conduct',
  'Compensation & Benefits',
  'Work Environment',
  'Policy Violation',
  'Harassment',
  'Other',
]

const priorities: GrievancePriority[] = ['Low', 'Medium', 'High']

export default function NewGrievancePage() {
  const { addGrievance } = useGrievances()
  const navigate = useNavigate()

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GrievanceCategory>('Workplace Conduct')
  const [priority, setPriority] = useState<GrievancePriority>('Medium')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<string | null>(null)

  const validate = () => {
    const next: Record<string, string> = {}
    if (subject.trim().length < 5) next.subject = 'Subject must be at least 5 characters.'
    if (description.trim().length < 20) next.description = 'Please provide at least 20 characters of detail.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    const grievance = addGrievance({ subject: subject.trim(), description: description.trim(), category, priority, isAnonymous })
    setSubmitted(grievance.id)
    setTimeout(() => navigate(`/grievances/${grievance.id}`), 1200)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Submit a Grievance</h1>
        <p className="mt-1 text-sm text-slate-500">
          Provide as much detail as possible so HR can review and act on it promptly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {errors.subject && <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as GrievancePriority)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe what happened, when, and who was involved..."
            className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Submit this grievance anonymously
        </label>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          disabled={!!submitted}
          className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitted ? 'Submitted ✓' : 'Submit Grievance'}
        </motion.button>
      </form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            Grievance <span className="font-semibold">{submitted}</span> submitted successfully. Redirecting to the
            detail page…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
