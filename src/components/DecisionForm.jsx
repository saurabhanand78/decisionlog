import { useState } from 'react'
import { Save } from 'lucide-react'
import { CATEGORIES, offsetDate, todayISO } from '../lib/logic'
import { PageHeader } from './ui'

function Field({ label, required, error, hint, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600" role="alert">{error}</p>}
    </div>
  )
}

export default function DecisionForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    existing
      ? {
          title: existing.title,
          category: existing.category,
          decisionDate: existing.decisionDate,
          description: existing.description,
          reason: existing.reason,
          expectedOutcome: existing.expectedOutcome,
          confidence: existing.confidence,
          reviewDate: existing.reviewDate,
        }
      : {
          title: '',
          category: 'Career',
          decisionDate: todayISO(),
          description: '',
          reason: '',
          expectedOutcome: '',
          confidence: 50,
          reviewDate: offsetDate(30),
        },
  )
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!form.title.trim()) er.title = 'Please give your decision a title.'
    if (!form.decisionDate) er.decisionDate = 'Please choose the decision date.'
    if (!form.reviewDate) er.reviewDate = 'Please choose a date to review the outcome.'
    else if (form.decisionDate && form.reviewDate < form.decisionDate)
      er.reviewDate = 'Review date cannot be before the decision date.'
    return er
  }

  const submit = (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      reason: form.reason.trim(),
      expectedOutcome: form.expectedOutcome.trim(),
      confidence: Number(form.confidence),
    })
  }

  return (
    <div className="fade-up mx-auto max-w-3xl">
      <PageHeader
        title={existing ? 'Edit Decision' : 'New Decision'}
        subtitle={existing ? 'Update the details of this decision.' : 'Capture what you decided, why, and what you expect to happen.'}
      />

      <form onSubmit={submit} noValidate className="card space-y-5 p-5 sm:p-7">
        <Field label="Decision Title" required error={errors.title} htmlFor="title">
          <input id="title" className={`input ${errors.title ? 'border-rose-400' : ''}`} placeholder="e.g. Switch to a standing desk" value={form.title} onChange={set('title')} autoFocus />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category">
            <select id="category" className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Decision Date" required error={errors.decisionDate} htmlFor="decisionDate">
            <input id="decisionDate" type="date" className="input" value={form.decisionDate} onChange={set('decisionDate')} />
          </Field>
        </div>

        <Field label="Decision Description" htmlFor="description" hint="What exactly are you deciding?">
          <textarea id="description" rows={3} className="input" value={form.description} onChange={set('description')} />
        </Field>

        <Field label="Reason for Decision" htmlFor="reason" hint="Why did you choose this option?">
          <textarea id="reason" rows={3} className="input" value={form.reason} onChange={set('reason')} />
        </Field>

        <Field label="Expected Outcome" htmlFor="expectedOutcome" hint="What do you expect to happen? Be specific so you can judge it later.">
          <textarea id="expectedOutcome" rows={3} className="input" value={form.expectedOutcome} onChange={set('expectedOutcome')} />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Confidence Level" htmlFor="confidence">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 px-3.5 py-2.5">
              <input id="confidence" type="range" min="0" max="100" step="5" className="w-full" value={form.confidence} onChange={set('confidence')} />
              <span className="w-12 text-right text-sm font-semibold tabular-nums text-indigo-600">{form.confidence}%</span>
            </div>
          </Field>
          <Field label="Review Date" required error={errors.reviewDate} htmlFor="reviewDate" hint="When should you check how it turned out?">
            <input id="reviewDate" type="date" className={`input ${errors.reviewDate ? 'border-rose-400' : ''}`} value={form.reviewDate} onChange={set('reviewDate')} />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary"><Save size={16} /> {existing ? 'Save Changes' : 'Save Decision'}</button>
        </div>
      </form>
    </div>
  )
}
