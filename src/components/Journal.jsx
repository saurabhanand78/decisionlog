import { useMemo, useState } from 'react'
import { ArrowDownUp, BookOpen, Pencil, Plus, Search, SearchX, Trash2 } from 'lucide-react'
import { CATEGORIES, STATUS, formatDate, getStatus } from '../lib/logic'
import { CategoryBadge, ConfidenceBar, ConfirmModal, EmptyState, PageHeader, StatusBadge } from './ui'

export default function Journal({ decisions, navigate, onDelete }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('newest')
  const [toDelete, setToDelete] = useState(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return decisions
      .filter((d) => (q ? d.title.toLowerCase().includes(q) : true))
      .filter((d) => (category === 'All' ? true : d.category === category))
      .filter((d) => (status === 'All' ? true : getStatus(d) === status))
      .sort((a, b) =>
        sort === 'newest'
          ? b.decisionDate.localeCompare(a.decisionDate) || b.createdAt - a.createdAt
          : a.decisionDate.localeCompare(b.decisionDate) || a.createdAt - b.createdAt,
      )
  }, [decisions, query, category, status, sort])

  const filtersActive = query || category !== 'All' || status !== 'All'
  const clearFilters = () => { setQuery(''); setCategory('All'); setStatus('All') }

  const stop = (fn) => (e) => { e.stopPropagation(); fn() }

  return (
    <div className="fade-up">
      <PageHeader
        title="Decision Journal"
        subtitle={`${decisions.length} decision${decisions.length === 1 ? '' : 's'} recorded`}
        action={<button className="btn-primary" onClick={() => navigate('form')}><Plus size={18} /> New Decision</button>}
      />

      {/* Filters */}
      <div className="card mb-4 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search by title…"
            aria-label="Search by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input" aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All statuses</option>
          {Object.values(STATUS).map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="relative">
          <ArrowDownUp size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select className="input pl-10" aria-label="Sort by date" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Date: newest first</option>
            <option value="oldest">Date: oldest first</option>
          </select>
        </div>
      </div>

      {decisions.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={BookOpen}
            title="No decisions yet"
            text="Your journal is empty. Record a decision to start learning from your outcomes."
            action={<button className="btn-primary" onClick={() => navigate('form')}><Plus size={16} /> New Decision</button>}
          />
        </div>
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={SearchX}
            title="No matching decisions"
            text="Try a different search or clear the filters."
            action={filtersActive && <button className="btn-secondary" onClick={clearFilters}>Clear filters</button>}
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card relative hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Decision</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Decided</th>
                  <th className="px-3 py-3 font-semibold">Confidence</th>
                  <th className="px-3 py-3 font-semibold">Review date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((d) => (
                  <tr key={d.id} onClick={() => navigate('detail', d.id)} className="cursor-pointer transition hover:bg-indigo-50/40">
                    <td className="max-w-xs px-5 py-3.5 font-medium text-slate-800">{d.title}</td>
                    <td className="px-3 py-3.5"><CategoryBadge category={d.category} /></td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-600">{formatDate(d.decisionDate)}</td>
                    <td className="px-3 py-3.5"><ConfidenceBar value={d.confidence} /></td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-600">{formatDate(d.reviewDate)}</td>
                    <td className="px-3 py-3.5"><StatusBadge status={getStatus(d)} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button aria-label={`Edit ${d.title}`} title="Edit" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600" onClick={stop(() => navigate('form', d.id))}>
                          <Pencil size={16} />
                        </button>
                        <button aria-label={`Delete ${d.title}`} title="Delete" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={stop(() => setToDelete(d))}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((d) => (
              <div key={d.id} onClick={() => navigate('detail', d.id)} className="card cursor-pointer p-4 transition active:bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800">{d.title}</p>
                  <div className="flex shrink-0 gap-1">
                    <button aria-label={`Edit ${d.title}`} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600" onClick={stop(() => navigate('form', d.id))}><Pencil size={16} /></button>
                    <button aria-label={`Delete ${d.title}`} className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600" onClick={stop(() => setToDelete(d))}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <CategoryBadge category={d.category} />
                  <StatusBadge status={getStatus(d)} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Decided {formatDate(d.decisionDate)}</span>
                  <span>Review {formatDate(d.reviewDate)}</span>
                </div>
                <div className="mt-2"><ConfidenceBar value={d.confidence} /></div>
              </div>
            ))}
          </div>
        </>
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete this decision?"
          message={`"${toDelete.title}" and any outcome review will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setToDelete(null)}
          onConfirm={() => { onDelete(toDelete.id); setToDelete(null) }}
        />
      )}
    </div>
  )
}
