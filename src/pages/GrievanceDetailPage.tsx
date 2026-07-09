import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useGrievances } from '../context/GrievanceContext'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import { formatDate, formatDateTime } from '../utils/format'

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  )
}

function FeedbackForm({ grievanceId }: { grievanceId: string }) {
  const { submitFeedback } = useGrievances()
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = () => {
    submitFeedback(grievanceId, feedback.trim(), rating)
    setDone(true)
  }

  if (done) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-brand-200 bg-brand-50/40 p-6 dark:border-brand-500/30 dark:bg-brand-500/10"
    >
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">Rate this resolution</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your feedback closes out this grievance.</p>

      <div className="mt-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl leading-none transition-colors ${star <= rating ? 'text-accent-orange' : 'text-slate-300 dark:text-slate-600'}`}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
        placeholder="Any comments on how this was resolved?"
        className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-3 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Submit Feedback &amp; Close
      </button>
    </motion.div>
  )
}

export default function GrievanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getGrievance } = useGrievances()
  const grievance = id ? getGrievance(id) : undefined

  if (!grievance) {
    return <Navigate to="/grievances" replace />
  }

  return (
    <div className="space-y-6">
      <Link
        to="/grievances"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to My Grievances
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {grievance.id} · {grievance.category} · {grievance.subCategory}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{grievance.subject}</h1>
          </div>
          <StatusBadge status={grievance.status} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <PriorityBadge priority={grievance.priority} />
          {grievance.dateOfIncident && (
            <span className="text-xs text-slate-400 dark:text-slate-500">Incident on {formatDate(grievance.dateOfIncident)}</span>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500">Submitted {formatDateTime(grievance.createdAt)}</span>
          {grievance.isConfidential && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Confidential submission
            </span>
          )}
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">{grievance.description}</p>

        {grievance.aiPriorityReasoning && (
          <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">AI Priority Assessment</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{grievance.aiPriorityReasoning}</p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-3">
          <Field label="Employee" value={`${grievance.employeeName} (${grievance.employeeId})`} />
          <Field label="Department" value={grievance.department} />
          <Field label="Unit / Location" value={grievance.unitLocation} />
          <Field label="Reporting Manager" value={grievance.reportingManager} />
          <Field label="Persons Involved" value={grievance.personsInvolved} />
          <Field label="Assigned To" value={grievance.assignedTo} />
          <Field label="Preferred Resolution" value={grievance.preferredResolution} />
        </div>

        {grievance.attachments.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">Attachments</p>
            <ul className="mt-1 space-y-1">
              {grievance.attachments.map((file) => (
                <li key={file.name} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  📎 {file.name}{' '}
                  <span className="font-normal text-slate-400 dark:text-slate-500">({(file.size / 1024).toFixed(0)} KB)</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {grievance.resolutionRemarks && (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">Resolution Remarks</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{grievance.resolutionRemarks}</p>
          </div>
        )}

        {grievance.closureRating !== null && (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">Your Feedback</p>
            <p className="mt-1 text-sm text-accent-orange">
              {'★'.repeat(grievance.closureRating)}
              {'☆'.repeat(5 - grievance.closureRating)}
            </p>
            {grievance.employeeFeedback && <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{grievance.employeeFeedback}</p>}
          </div>
        )}
      </motion.div>

      {grievance.status === 'Resolved' && <FeedbackForm grievanceId={grievance.id} />}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="mb-5 font-semibold text-slate-900 dark:text-slate-100">Status Timeline</h2>
        <ol className="space-y-6">
          {grievance.timeline.map((event, index) => (
            <li key={index} className="relative flex gap-4 pl-1">
              <div className="flex flex-col items-center">
                <span className="z-10 flex h-3 w-3 shrink-0 rounded-full bg-brand-600" />
                {index < grievance.timeline.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-800" style={{ minHeight: 32 }} />
                )}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={event.status} />
                  <span className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(event.timestamp)}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{event.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  )
}
