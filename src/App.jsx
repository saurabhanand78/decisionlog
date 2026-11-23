import { useCallback, useState } from 'react'
import { BookOpen, CheckCheck, LayoutDashboard, Menu, PlusCircle, Settings as SettingsIcon, X } from 'lucide-react'
import { useDecisions } from './lib/useDecisions'
import Dashboard from './components/Dashboard'
import Journal from './components/Journal'
import DecisionForm from './components/DecisionForm'
import DecisionDetail from './components/DecisionDetail'
import Settings from './components/Settings'
import { Toast } from './components/ui'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'journal', label: 'Decision Journal', icon: BookOpen },
  { id: 'form', label: 'Add Decision', icon: PlusCircle },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function App() {
  const { decisions, addDecision, updateDecision, deleteDecision, saveReview, resetDemoData } = useDecisions()
  // Simple state-based routing: { name, id }
  const [view, setView] = useState({ name: 'dashboard', id: null })
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const navigate = useCallback((name, id = null) => {
    setView({ name, id })
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }, [])

  const notify = (message) => setToast({ message, key: Date.now() })
  const find = (id) => decisions.find((d) => d.id === id)

  // Sidebar highlight: detail pages belong to the journal; editing belongs to Add Decision
  const activeNav = view.name === 'detail' ? 'journal' : view.name

  let screen
  switch (view.name) {
    case 'journal':
      screen = (
        <Journal
          decisions={decisions}
          navigate={navigate}
          onDelete={(id) => { deleteDecision(id); notify('Decision deleted') }}
        />
      )
      break
    case 'form': {
      const existing = view.id ? find(view.id) : null
      screen = (
        <DecisionForm
          key={view.id || 'new'}
          existing={existing}
          onCancel={() => navigate(existing ? 'detail' : 'journal', existing?.id)}
          onSave={(data) => {
            if (existing) {
              updateDecision(existing.id, data)
              notify('Decision updated')
              navigate('detail', existing.id)
            } else {
              const created = addDecision(data)
              notify('Decision saved to your journal')
              navigate('detail', created.id)
            }
          }}
        />
      )
      break
    }
    case 'detail':
      screen = (
        <DecisionDetail
          key={view.id}
          decision={find(view.id)}
          navigate={navigate}
          onSaveReview={(id, review, wasEdit) => {
            saveReview(id, review)
            notify(wasEdit ? 'Review updated' : 'Review saved. Decision marked as reviewed')
          }}
          onDelete={(id) => { deleteDecision(id); notify('Decision deleted'); navigate('journal') }}
        />
      )
      break
    case 'settings':
      screen = <Settings count={decisions.length} onReset={() => { resetDemoData(); notify('Demo data restored') }} />
      break
    default:
      screen = <Dashboard decisions={decisions} navigate={navigate} />
  }

  const NavList = (
    <nav className="mt-6 space-y-1">
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = activeNav === id && !(id === 'form' && view.id)
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            aria-current={active ? 'page' : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        )
      })}
    </nav>
  )

  const Brand = (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <CheckCheck size={20} />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">DecisionLog</span>
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
        {Brand}
        <button className="btn-primary mt-6 w-full" onClick={() => navigate('form')}>+ New Decision</button>
        {NavList}
        <p className="mt-auto text-xs leading-relaxed text-slate-400">Data stays in this browser.</p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        {Brand}
        <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-x-0 top-[61px] z-20 border-b border-slate-200 bg-white px-4 pb-4 shadow-pop lg:hidden">
          <button className="btn-primary mt-4 w-full" onClick={() => navigate('form')}>+ New Decision</button>
          {NavList}
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">{screen}</div>
      </main>

      <Toast key={toast?.key} toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
