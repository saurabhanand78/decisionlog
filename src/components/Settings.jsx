import { useState } from 'react'
import { Database, HardDrive, RotateCcw } from 'lucide-react'
import { ConfirmModal, PageHeader } from './ui'

export default function Settings({ count, onReset }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="fade-up mx-auto max-w-2xl">
      <PageHeader title="Settings" subtitle="Keep it simple: a few details and one reset button." />

      <div className="space-y-4">
        <section className="card p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">DecisionLog</h2>
          <p className="mt-1 text-sm text-slate-500">
            A personal decision journal and outcome tracker. Make decisions. Track outcomes. Learn from experience.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Database size={20} className="text-indigo-600" />
            <div>
              <p className="text-sm text-slate-500">Stored decisions</p>
              <p className="text-xl font-bold text-slate-900">{count}</p>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-sm text-slate-500">
            <HardDrive size={16} className="mt-0.5 shrink-0" />
            All data is stored locally in this browser (localStorage). Nothing is sent to a server, and clearing site data or using another browser starts fresh.
          </p>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Reset Demo Data</h2>
          <p className="mt-1 text-sm text-slate-500">
            Replace everything with the original sample decisions. Any decisions or reviews you added will be lost.
          </p>
          <button className="btn-secondary mt-4 text-rose-600 hover:bg-rose-50" onClick={() => setConfirming(true)}>
            <RotateCcw size={16} /> Reset Demo Data
          </button>
        </section>
      </div>

      {confirming && (
        <ConfirmModal
          title="Reset demo data?"
          message="All of your current decisions and reviews will be replaced with the original sample data. This cannot be undone."
          confirmLabel="Reset data"
          onCancel={() => setConfirming(false)}
          onConfirm={() => { onReset(); setConfirming(false) }}
        />
      )}
    </div>
  )
}
