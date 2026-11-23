// Shared constants and pure helper functions (no React in here).

export const CATEGORIES = ['Career', 'Finance', 'Technology', 'Learning', 'Personal', 'Other']

export const RATINGS = ['Better Than Expected', 'As Expected', 'Worse Than Expected']
export const AGAIN_OPTIONS = ['Yes', 'No', 'Unsure']

export const STATUS = {
  AWAITING: 'Awaiting Review',
  DUE: 'Review Due',
  REVIEWED: 'Reviewed',
}

// ---- Dates (all stored as local "YYYY-MM-DD" strings) ----
const pad = (n) => String(n).padStart(2, '0')

export function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO() {
  return toISO(new Date())
}

export function offsetDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toISO(d)
}

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(iso) {
  if (!iso) return '—'
  return parseISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysBetween(fromISO, toISOStr) {
  return Math.round((parseISO(toISOStr) - parseISO(fromISO)) / 86400000)
}

// Human wording for a review date relative to today
export function relativeReview(iso) {
  const diff = daysBetween(todayISO(), iso)
  if (diff === 0) return 'Due today'
  if (diff < 0) return `${Math.abs(diff)} day${diff === -1 ? '' : 's'} overdue`
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

// ---- Status ----
export function getStatus(decision) {
  if (decision.review) return STATUS.REVIEWED
  return decision.reviewDate <= todayISO() ? STATUS.DUE : STATUS.AWAITING
}

// ---- Dashboard stats ----
export function computeStats(decisions) {
  const reviewed = decisions.filter((d) => d.review)
  const pending = decisions.filter((d) => !d.review)
  const positive = reviewed.filter((d) => d.review.rating !== 'Worse Than Expected').length

  const byCategory = CATEGORIES.map((c) => ({
    name: c,
    count: decisions.filter((d) => d.category === c).length,
  }))

  const outcomes = RATINGS.map((r) => ({
    name: r,
    value: reviewed.filter((d) => d.review.rating === r).length,
  }))

  const upcoming = [...pending].sort((a, b) => a.reviewDate.localeCompare(b.reviewDate))
  const recent = [...decisions]
    .sort((a, b) => b.createdAt - a.createdAt || b.decisionDate.localeCompare(a.decisionDate))
    .slice(0, 5)

  return {
    total: decisions.length,
    awaiting: pending.length,
    reviewed: reviewed.length,
    // null (not 0) when nothing is reviewed, so the UI can show an empty state
    positiveRate: reviewed.length ? Math.round((positive / reviewed.length) * 100) : null,
    byCategory,
    outcomes,
    upcoming,
    recent,
  }
}

export function newId() {
  return `d_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}
