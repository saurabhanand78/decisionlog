import { useState } from 'react'
import { ArrowLeft, CalendarCheck, CalendarDays, Lightbulb, Pencil, Repeat, Save, Target, Trash2, ClipboardCheck, Flag } from 'lucide-react'
import { AGAIN_OPTIONS, RATINGS, formatDate, getStatus, relativeReview, STATUS, todayISO } from '../lib/logic'
import { CategoryBadge, ConfidenceBar, ConfirmModal, RatingBadge, RATING_COLORS, StatusBadge } from './ui'

function TextBlock({ icon: Icon, title, text }) {
  return (
    <div>
      <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={14} /> {title}
      </h3>
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
        {text || <span className="italic text-slate-400">Not provided</span>}
      </p>
    </div>
  )
}

function ReviewForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState({
    actualOutcome: existing?.actualOutcome || '',
    rating: existing?.rating || '',
    lessons: existing?.lessons || '',
    again: existing?.again || '',
    reviewedOn: existing?.reviewedOn || todayISO(),
  })
  const [errors, setErrors] = useState({})
  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!form.actualOutcome.trim()) er.actualOutcome = 'Describe what actually happened.'
    if (!form.rating) er.rating = 'Choose an outcome rating.'
    if (!form.again) er.again = 'Choose whether you would decide the same way.'
    if (!form.reviewedOn) er.reviewedOn = 'Please choose a review date.'
    setErrors(er)
    if (Object.keys(er).length) return
    onSave({ ...form, actualOutcome: form.actualOutcome.trim(), lessons: form.lessons.trim() })
  }

  const Err = ({ k }) => errors[k] ? <p className="mt-1 text-xs font-medium text-rose-600" role="alert">{errors[k]}</p> : null

  return (
    <form onSubmit={submit} noValidate className="card fade-up space-y-5 border-indigo-200 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">{existing ? 'Edit Outcome Review' : 'Review Outcome'}</h2>

      <div>
        <label className="label" htmlFor="actual">Actual Outcome <span className="text-rose-500">*</span></label>
        <textarea id="actual" rows={3} className={`input ${errors.actualOutcome ? 'border-rose-400' : ''}`} placeholder="What actually happened?" value={form.actualOutcome} onChange={(e) => set('actualOutcome')(e.target.value)} />
        <Err k="actualOutcome" />
      </div>

      <div>
        <span className="label">Outcome Rating <span className="text-rose-500">*</span></span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {RATINGS.map((r) => {
            const on = form.rating === r
            return (
              <button
                type="button"
                key={r}
                onClick={() => set('rating')(r)}
                aria-pressed={on}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${on ? 'text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                style={on ? { background: RATING_COLORS[r], borderColor: RATING_COLORS[r] } : undefined}
              >
                {r}
              </button>
            )
          })}
        </div>
        <Err k="rating" />
      </div>

      <div>
        <label className="label" htmlFor="lessons">Lessons Learned</label>
        <textarea id="lessons" rows={3} className="input" placeholder="What did you learn from this decision?" value={form.lessons} onChange={(e) => set('lessons')(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <span className="label">Would You Make the Same Decision Again? <span className="text-rose-500">*</span></span>
          <div className="grid grid-cols-3 gap-2">
            {AGAIN_OPTIONS.map((o) => {
              const on = form.again === o
              return (
                <button
                  type="button"
                  key={o}
                  aria-pressed={on}
                  onClick={() => set('again')(o)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {o}
                </button>
              )
            })}
          </div>
          <Err k="again" />
        </div>
        <div>
          <label className="label" htmlFor="reviewedOn">Review Date</label>
          <input id="reviewedOn" type="date" className="input" value={form.reviewedOn} onChange={(e) => set('reviewedOn')(e.target.value)} />
          <Err k="reviewedOn" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary"><Save size={16} /> Save Review</button>
      </div>
    </form>
  )
}

export default function DecisionDetail({ decision, navigate, onSaveReview, onDelete }) {
  const [reviewing, setReviewing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!decision) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="font-semibold text-slate-800">Decision not found</p>
        <p className="mt-1 text-sm text-slate-500">It may have been deleted.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('journal')}>Back to journal</button>
      </div>
    )
  }

  const status = getStatus(decision)
  const r = decision.review

  return (
    <div className="fade-up mx-auto max-w-4xl space-y-5">
      <button onClick={() => navigate('journal')} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to journal
      </button>

      {/* Header */}
      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <CategoryBadge category={decision.category} />
              <StatusBadge status={status} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{decision.title}</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => navigate('form', decision.id)}><Pencil size={16} /> Edit</button>
            <button className="btn-secondary text-rose-600 hover:bg-rose-50" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Delete</button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><CalendarDays size={14} /> Decided</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(decision.decisionDate)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><CalendarCheck size={14} /> Review date</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(decision.reviewDate)}
              {!r && (
                <span className={`ml-2 text-xs font-medium ${status === STATUS.DUE ? 'text-rose-600' : 'text-slate-500'}`}>
                  {relativeReview(decision.reviewDate)}
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Confidence</p>
            <div className="mt-1.5"><ConfidenceBar value={decision.confidence} /></div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <TextBlock icon={Flag} title="Description" text={decision.description} />
          <TextBlock icon={Lightbulb} title="Reason for decision" text={decision.reason} />
        </div>
      </div>

      {/* Review action / form */}
      {!r && !reviewing && (
        <div className={`card flex flex-wrap items-center justify-between gap-4 p-5 ${status === STATUS.DUE ? 'border-rose-200 bg-rose-50/40' : ''}`}>
          <div>
            <p className="font-semibold text-slate-900">
              {status === STATUS.DUE ? 'This decision is ready for review' : 'Not due for review yet'}
            </p>
            <p className="text-sm text-slate-500">Compare what you expected with what actually happened.</p>
          </div>
          <button className="btn-primary" onClick={() => setReviewing(true)}><ClipboardCheck size={16} /> Review Outcome</button>
        </div>
      )}

      {reviewing && (
        <ReviewForm
          existing={r}
          onCancel={() => setReviewing(false)}
          onSave={(review) => { onSaveReview(decision.id, review, !!r); setReviewing(false) }}
        />
      )}

      {/* Expected vs actual */}
      <div className={`grid grid-cols-1 gap-4 ${r ? 'md:grid-cols-2' : ''}`}>
        <div className="card p-5 sm:p-6">
          <TextBlock icon={Target} title="Expected outcome" text={decision.expectedOutcome} />
        </div>

        {r && (
          <div className="card border-indigo-200 p-5 sm:p-6">
            <TextBlock icon={ClipboardCheck} title="Actual outcome" text={r.actualOutcome} />
          </div>
        )}
      </div>

      {r && !reviewing && (
        <div className="card p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Outcome rating</p>
              <RatingBadge rating={r.rating} large />
            </div>
            <button className="btn-secondary" onClick={() => setReviewing(true)}><Pencil size={16} /> Edit Review</button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <TextBlock icon={Lightbulb} title="Lessons learned" text={r.lessons} />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Repeat size={14} /> Decide the same again?</h3>
                <p className="text-sm font-semibold text-slate-800">{r.again}</p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><CalendarCheck size={14} /> Reviewed on</h3>
                <p className="text-sm font-semibold text-slate-800">{formatDate(r.reviewedOn)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete this decision?"
          message={`"${decision.title}" and any outcome review will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => onDelete(decision.id)}
        />
      )}
    </div>
  )
}
