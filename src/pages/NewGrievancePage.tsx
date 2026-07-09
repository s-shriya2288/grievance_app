import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useGrievances } from '../context/GrievanceContext'
import { prioritizeGrievance } from '../api/prioritize'
import { GRIEVANCE_CATEGORIES, GRIEVANCE_SUBCATEGORIES } from '../types'
import type { GrievanceAttachment, GrievanceCategory } from '../types'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20'

export default function NewGrievancePage() {
  const { employee } = useAuth()
  const { addGrievance } = useGrievances()
  const navigate = useNavigate()

  const [category, setCategory] = useState<GrievanceCategory>(GRIEVANCE_CATEGORIES[0])
  const [subCategory, setSubCategory] = useState(GRIEVANCE_SUBCATEGORIES[GRIEVANCE_CATEGORIES[0]][0])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [dateOfIncident, setDateOfIncident] = useState('')
  const [personsInvolved, setPersonsInvolved] = useState('')
  const [attachments, setAttachments] = useState<GrievanceAttachment[]>([])
  const [isConfidential, setIsConfidential] = useState(false)
  const [preferredResolution, setPreferredResolution] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'error'>('idle')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const subCategoryOptions = useMemo(() => GRIEVANCE_SUBCATEGORIES[category], [category])
  const today = new Date().toISOString().slice(0, 10)

  const handleCategoryChange = (next: GrievanceCategory) => {
    setCategory(next)
    setSubCategory(GRIEVANCE_SUBCATEGORIES[next][0])
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setAttachments(files.map((file) => ({ name: file.name, size: file.size })))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (subject.trim().length < 5) next.subject = 'Subject must be at least 5 characters.'
    if (description.trim().length < 20) next.description = 'Please provide at least 20 characters of detail.'
    if (dateOfIncident && dateOfIncident > today) next.dateOfIncident = 'Date of incident cannot be in the future.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!employee || !validate()) return

    setPhase('analyzing')
    try {
      const aiResult = await prioritizeGrievance({
        category,
        subCategory,
        subject: subject.trim(),
        description: description.trim(),
        personsInvolved: personsInvolved.trim(),
        isConfidential,
      })

      const grievance = addGrievance(employee, {
        category,
        subCategory,
        subject: subject.trim(),
        description: description.trim(),
        dateOfIncident,
        personsInvolved: personsInvolved.trim(),
        attachments,
        isConfidential,
        preferredResolution: preferredResolution.trim(),
        priority: aiResult.priority,
        aiPriorityReasoning: aiResult.reasoning,
        assignedTo: aiResult.suggestedTeam,
      })

      setSubmitted(grievance.id)
      setTimeout(() => navigate(`/grievances/${grievance.id}`), 1400)
    } catch {
      setPhase('error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Submit a Grievance</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Provide as much detail as possible. Our AI triage assistant will review the details and assign a
          priority automatically — you don't need to set one yourself.
        </p>
      </div>

      {employee && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Employee ID</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{employee.employeeCode}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Name</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{employee.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Department</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{employee.department}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Unit / Location</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{employee.unitLocation}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Reporting Manager</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{employee.reportingManager}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Grievance Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as GrievanceCategory)}
              className={inputClass}
            >
              {GRIEVANCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subCategory" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Sub-category
            </label>
            <select
              id="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className={inputClass}
            >
              {subCategoryOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Subject
          </label>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            className={inputClass}
          />
          {errors.subject && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Detailed Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what happened, when, and who was involved..."
            className={`resize-none ${inputClass}`}
          />
          {errors.description && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dateOfIncident" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date of Incident <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <input
              id="dateOfIncident"
              type="date"
              value={dateOfIncident}
              max={today}
              onChange={(e) => setDateOfIncident(e.target.value)}
              className={inputClass}
            />
            {errors.dateOfIncident && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.dateOfIncident}</p>}
          </div>
          <div>
            <label htmlFor="personsInvolved" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Persons Involved <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <input
              id="personsInvolved"
              value={personsInvolved}
              onChange={(e) => setPersonsInvolved(e.target.value)}
              placeholder="Names / roles, if applicable"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="attachments" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Supporting Documents / Attachments <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
          </label>
          <input
            id="attachments"
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-slate-400 dark:file:bg-brand-500/15 dark:file:text-brand-300 dark:hover:file:bg-brand-500/25"
          />
          {attachments.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {attachments.map((file) => (
                <li key={file.name}>
                  {file.name} · {(file.size / 1024).toFixed(0)} KB
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="preferredResolution" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Preferred Resolution <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
          </label>
          <textarea
            id="preferredResolution"
            value={preferredResolution}
            onChange={(e) => setPreferredResolution(e.target.value)}
            rows={3}
            placeholder="What outcome would resolve this for you?"
            className={`resize-none ${inputClass}`}
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Confidential Submission</legend>
          <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="confidential"
                checked={!isConfidential}
                onChange={() => setIsConfidential(false)}
                className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
              />
              No
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="confidential"
                checked={isConfidential}
                onChange={() => setIsConfidential(true)}
                className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
              />
              Yes, keep my identity confidential
            </label>
          </div>
        </fieldset>

        {phase === 'error' && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            Something went wrong reaching the AI triage service. Please try submitting again.
          </p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          disabled={phase !== 'idle' && phase !== 'error'}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {phase === 'analyzing' && (
            <motion.span
              className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
            />
          )}
          {phase === 'analyzing' ? 'AI is analyzing priority…' : submitted ? 'Submitted ✓' : 'Submit Grievance'}
        </motion.button>
      </form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            Grievance <span className="font-semibold">{submitted}</span> submitted and prioritized by AI.
            Redirecting to the detail page…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
