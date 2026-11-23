import { useMemo } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts'
import { AlertTriangle, BookOpen, CheckCircle2, ClipboardCheck, ListChecks, Plus, ThumbsUp, Timer } from 'lucide-react'
import { computeStats, formatDate, getStatus, relativeReview, todayISO } from '../lib/logic'
import { CategoryBadge, EmptyState, PageHeader, RATING_COLORS, StatusBadge, categoryColor } from './ui'

function KpiCard({ icon: Icon, label, value, hint, tone }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    sky: 'bg-sky-50 text-sky-600',
  }
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
}

function Section({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card p-5 ${className}`}>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mb-3 text-xs text-slate-500">{subtitle}</p>}
      {children}
    </section>
  )
}

export default function Dashboard({ decisions, navigate }) {
  const stats = useMemo(() => computeStats(decisions), [decisions])
  const today = todayISO()
  const overdueCount = stats.upcoming.filter((d) => d.reviewDate <= today).length
  const hasOutcomes = stats.outcomes.some((o) => o.value > 0)

  return (
    <div className="fade-up">
      <PageHeader
        title="Dashboard"
        subtitle="Make decisions. Track outcomes. Learn from experience."
        action={
          <button className="btn-primary" onClick={() => navigate('form')}>
            <Plus size={18} /> New Decision
          </button>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={BookOpen} tone="indigo" label="Total Decisions Recorded" value={stats.total} hint="All decisions in your journal" />
        <KpiCard
          icon={Timer}
          tone="amber"
          label="Decisions Awaiting Review"
          value={stats.awaiting}
          hint={overdueCount ? `${overdueCount} ready or overdue for review` : 'None ready for review yet'}
        />
        <KpiCard icon={ClipboardCheck} tone="sky" label="Decisions Reviewed" value={stats.reviewed} hint="Outcome compared with expectation" />
        <KpiCard
          icon={ThumbsUp}
          tone="emerald"
          label="Positive Outcome Rate"
          value={stats.positiveRate === null ? '—' : `${stats.positiveRate}%`}
          hint={
            stats.positiveRate === null
              ? 'Review a decision to see this rate'
              : 'Reviewed decisions rated "Better" or "As Expected"'
          }
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Section title="Decisions by Category" subtitle="How your decisions are spread across areas of life" className="lg:col-span-3">
          {stats.total === 0 ? (
            <EmptyState icon={ListChecks} title="No decisions yet" text="Record your first decision to see the breakdown." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byCategory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="count" name="Decisions" radius={[8, 8, 0, 0]} maxBarSize={48}>
                    {stats.byCategory.map((c) => (
                      <Cell key={c.name} fill={categoryColor(c.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Section>

        <Section title="Outcome Summary" subtitle="How reviewed decisions turned out" className="lg:col-span-2">
          {!hasOutcomes ? (
            <EmptyState icon={CheckCircle2} title="No reviews yet" text="Review a decision outcome and your results will appear here." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.outcomes} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} stroke="none">
                    {stats.outcomes.map((o) => (
                      <Cell key={o.name} fill={RATING_COLORS[o.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Section>
      </div>

      {/* Lists */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Upcoming Reviews" subtitle="Overdue first, then in date order">
          {stats.upcoming.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="All caught up" text="No decisions are waiting for a review." />
          ) : (
            <ul className="-mx-2 divide-y divide-slate-100">
              {stats.upcoming.slice(0, 6).map((d) => {
                const overdue = d.reviewDate <= today
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => navigate('detail', d.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-slate-50 ${
                        overdue ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{d.title}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <CategoryBadge category={d.category} />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-slate-500">{formatDate(d.reviewDate)}</p>
                        <p className={`mt-0.5 flex items-center justify-end gap-1 text-xs font-semibold ${overdue ? 'text-rose-600' : 'text-slate-600'}`}>
                          {overdue && <AlertTriangle size={12} />}
                          {relativeReview(d.reviewDate)}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        <Section title="Recent Decisions" subtitle="Your five latest entries">
          {stats.recent.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Your journal is empty"
              text="Start by recording a decision you recently made."
              action={<button className="btn-primary" onClick={() => navigate('form')}><Plus size={16} /> New Decision</button>}
            />
          ) : (
            <ul className="-mx-2 divide-y divide-slate-100">
              {stats.recent.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => navigate('detail', d.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{d.title}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <CategoryBadge category={d.category} />
                        <span className="text-xs text-slate-400">{formatDate(d.decisionDate)}</span>
                      </div>
                    </div>
                    <StatusBadge status={getStatus(d)} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}
