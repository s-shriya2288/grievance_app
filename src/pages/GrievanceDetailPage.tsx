import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useGrievances } from '../context/GrievanceContext'
import { PriorityBadge, StatusBadge } from '../components/StatusBadge'
import CategoryChip from '../components/CategoryChip'
import { ApiError } from '../api/client'
import { formatDate, formatDateTime } from '../utils/format'
import type { Grievance, GrievanceStatus } from '../types/api'

const ADMIN_ROLES = ['Department Admin', 'Super Admin']
const adminStatusOptions: GrievanceStatus[] = ['Open', 'InProgress', 'Resolved']
const adminStatusLabels: Record<GrievanceStatus, string> = {
  Open: 'Open',
  InProgress: 'In Progress',
  Resolved: 'Resolved',
  Closed: 'Closed',
}

function AdminActionsPanel({ grievance }: { grievance: Grievance }) {
  const { user } = useAuth()
  const { updateStatus } = useGrievances()
  const [status, setStatus] = useState<GrievanceStatus>(grievance.status === 'Closed' ? 'Resolved' : grievance.status)
  const [resolution, setResolution] = useState(grievance.resolution ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!user || !ADMIN_ROLES.includes(user.role) || grievance.status === 'Closed') return null

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateStatus(grievance.id, {
        status,
        resolution: resolution.trim() || null,
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleAssignToMe = async () => {
    setSaving(true)
    try {
      await updateStatus(grievance.id, { assignedAdminId: user.id })
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-sky-200 bg-sky-50/40 p-6 dark:border-sky-500/30 dark:bg-sky-500/10"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Admin Actions</h2>
        {!grievance.assignedAdmin && (
          <button
            type="button"
            onClick={handleAssignToMe}
            disabled={saving}
            className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-300"
          >
            Assign to me
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as GrievanceStatus)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {adminStatusOptions.map((s) => (
              <option key={s} value={s}>
                {adminStatusLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Resolution Remarks</label>
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          rows={3}
          placeholder="Required before marking Resolved"
          className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-4 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
      </button>
    </motion.div>
  )
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  )
}

interface TimelineEntry {
  label: string
  timestamp: string
  note?: string
}

function buildTimeline(grievance: Grievance): TimelineEntry[] {
  const entries: TimelineEntry[] = [{ label: 'Submitted', timestamp: grievance.createdAt }]
  for (const comment of grievance.comments) {
    entries.push({
      label: `Comment · ${comment.user.firstName} ${comment.user.lastName}`,
      timestamp: comment.createdAt,
      note: comment.comment,
    })
  }
  if (grievance.resolvedAt) entries.push({ label: 'Resolved', timestamp: grievance.resolvedAt, note: grievance.resolution ?? undefined })
  if (grievance.satisfaction) {
    entries.push({
      label: 'Employee Review',
      timestamp: grievance.satisfaction.createdAt,
      note: `Rated ${grievance.satisfaction.rating}/5${grievance.satisfaction.feedback ? ` — ${grievance.satisfaction.feedback}` : ''}`,
    })
  }
  if (grievance.closedAt) entries.push({ label: 'Closed', timestamp: grievance.closedAt })
  return entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

function FeedbackForm({ grievanceId }: { grievanceId: string }) {
  const { submitSatisfaction } = useGrievances()
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitSatisfaction(grievanceId, rating, feedback.trim())
    } finally {
      setSubmitting(false)
    }
  }

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
        disabled={submitting}
        className="mt-3 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Feedback & Close'}
      </button>
    </motion.div>
  )
}

function CommentForm({ grievanceId }: { grievanceId: string }) {
  const { addComment } = useGrievances()
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      await addComment(grievanceId, comment.trim())
      setComment('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment…"
        className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-500/20"
      />
      <button
        type="submit"
        disabled={submitting || !comment.trim()}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Post
      </button>
    </form>
  )
}

export default function GrievanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getGrievance, fetchGrievance, reopenGrievance } = useGrievances()
  const [grievance, setGrievance] = useState<Grievance | undefined>(id ? getGrievance(id) : undefined)
  const [notFound, setNotFound] = useState(false)
  const [reopening, setReopening] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchGrievance(id)
      .then(setGrievance)
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setNotFound(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (notFound) {
    navigate('/grievances', { replace: true })
    return null
  }
  if (!grievance) return null

  const handleReopen = async () => {
    setReopening(true)
    try {
      await reopenGrievance(grievance.id)
      if (id) setGrievance(await fetchGrievance(id))
    } finally {
      setReopening(false)
    }
  }

  const timeline = buildTimeline(grievance)

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
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={grievance.category.categoryName} />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {grievance.ticketNumber} · {grievance.subcategory.subcategoryName}
              </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{grievance.subject}</h1>
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
          {grievance.reopenCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              Reopened {grievance.reopenCount}×
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
          <Field label="Employee" value={`${grievance.employee.firstName} ${grievance.employee.lastName} (${grievance.employee.employeeId})`} />
          <Field label="Department" value={grievance.department.departmentName} />
          <Field label="Persons Involved" value={grievance.personsInvolved} />
          <Field label="Assigned To" value={grievance.assignedAdmin ? `${grievance.assignedAdmin.firstName} ${grievance.assignedAdmin.lastName}` : `${grievance.department.departmentName} Department`} />
          <Field label="Preferred Resolution" value={grievance.preferredResolution} />
        </div>

        {grievance.resolution && (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">Resolution Remarks</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{grievance.resolution}</p>
          </div>
        )}

        {grievance.satisfaction && (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">Your Feedback</p>
            <p className="mt-1 text-sm text-accent-orange">
              {'★'.repeat(grievance.satisfaction.rating)}
              {'☆'.repeat(5 - grievance.satisfaction.rating)}
            </p>
            {grievance.satisfaction.feedback && <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{grievance.satisfaction.feedback}</p>}
          </div>
        )}

        {(grievance.status === 'Resolved' || grievance.status === 'Closed') && user?.id === grievance.employee.id && (
          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReopen}
              disabled={reopening}
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              {reopening ? 'Reopening…' : 'Reopen — the issue still exists'}
            </button>
          </div>
        )}
      </motion.div>

      <AdminActionsPanel grievance={grievance} />

      {grievance.status === 'Resolved' && user?.id === grievance.employee.id && <FeedbackForm grievanceId={grievance.id} />}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="mb-5 font-semibold text-slate-900 dark:text-slate-100">Status Timeline</h2>
        <ol className="mb-6 space-y-6">
          {timeline.map((entry, index) => (
            <li key={index} className="relative flex gap-4 pl-1">
              <div className="flex flex-col items-center">
                <span className="z-10 flex h-3 w-3 shrink-0 rounded-full bg-brand-600" />
                {index < timeline.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-800" style={{ minHeight: 32 }} />
                )}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{entry.label}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(entry.timestamp)}</span>
                </div>
                {entry.note && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{entry.note}</p>}
              </div>
            </li>
          ))}
        </ol>
        <CommentForm grievanceId={grievance.id} />
      </motion.div>
    </div>
  )
}
