import { useEffect } from 'react'
import {
  AlertTriangle, Briefcase, CheckCircle2, Clock, GraduationCap, Heart,
  Laptop, MoreHorizontal, Wallet, X, XCircle,
} from 'lucide-react'
import { STATUS } from '../lib/logic'

// ---------- Category badge ----------
const CATEGORY_STYLES = {
  Career: { cls: 'bg-violet-50 text-violet-700 ring-violet-200', icon: Briefcase, color: '#8b5cf6' },
  Finance: { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: Wallet, color: '#10b981' },
  Technology: { cls: 'bg-sky-50 text-sky-700 ring-sky-200', icon: Laptop, color: '#0ea5e9' },
  Learning: { cls: 'bg-amber-50 text-amber-700 ring-amber-200', icon: GraduationCap, color: '#f59e0b' },
  Personal: { cls: 'bg-pink-50 text-pink-700 ring-pink-200', icon: Heart, color: '#ec4899' },
  Other: { cls: 'bg-slate-100 text-slate-600 ring-slate-200', icon: MoreHorizontal, color: '#94a3b8' },
}

export const categoryColor = (c) => (CATEGORY_STYLES[c] || CATEGORY_STYLES.Other).color

export function CategoryBadge({ category }) {
  const s = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}`}>
      <Icon size={12} /> {category}
    </span>
  )
}

// ---------- Status badge ----------
const STATUS_STYLES = {
  [STATUS.AWAITING]: { cls: 'bg-blue-50 text-blue-700 ring-blue-200', icon: Clock },
  [STATUS.DUE]: { cls: 'bg-rose-50 text-rose-700 ring-rose-200', icon: AlertTriangle },
  [STATUS.REVIEWED]: { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: CheckCircle2 },
}

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status]
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}`}>
      <Icon size={12} /> {status}
    </span>
  )
}

// ---------- Outcome rating ----------
export const RATING_COLORS = {
  'Better Than Expected': '#10b981',
  'As Expected': '#6366f1',
  'Worse Than Expected': '#f43f5e',
}

const RATING_STYLES = {
  'Better Than Expected': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'As Expected': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Worse Than Expected': 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function RatingBadge({ rating, large }) {
  const Icon = rating === 'Worse Than Expected' ? XCircle : CheckCircle2
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${RATING_STYLES[rating]} ${
        large ? 'px-4 py-1.5 text-base' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <Icon size={large ? 18 : 12} /> {rating}
    </span>
  )
}

// ---------- Confidence mini bar ----------
export function ConfidenceBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums text-slate-600">{value}%</span>
    </div>
  )
}

// ---------- Page header ----------
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ---------- Empty state ----------
export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ---------- Modal (used for confirmations) ----------
export function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel, danger = true }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        className="fade-up w-full max-w-md rounded-2xl bg-white p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ---------- Toast ----------
export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null
  return (
    <div className="fixed bottom-5 right-5 z-[60] fade-up" role="status">
      <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-pop">
        <CheckCircle2 size={18} className="text-emerald-400" />
        {toast.message}
        <button onClick={onClose} aria-label="Dismiss" className="ml-1 text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
