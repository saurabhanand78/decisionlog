import { useCallback, useEffect, useState } from 'react'
import { buildSampleData } from './sampleData'
import { newId } from './logic'

// Single place that talks to localStorage. To add a backend later,
// only this hook needs to change.
const KEY = 'decisionlog.decisions.v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // corrupted or unavailable storage: fall through to sample data
  }
  const seed = buildSampleData()
  try {
    localStorage.setItem(KEY, JSON.stringify(seed))
  } catch {
    /* ignore */
  }
  return seed
}

export function useDecisions() {
  const [decisions, setDecisions] = useState(load)

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(decisions))
    } catch {
      /* storage full or blocked: app still works in memory */
    }
  }, [decisions])

  const addDecision = useCallback((data) => {
    const decision = { ...data, id: newId(), createdAt: Date.now(), review: null }
    setDecisions((prev) => [decision, ...prev])
    return decision
  }, [])

  const updateDecision = useCallback((id, data) => {
    setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)))
  }, [])

  const deleteDecision = useCallback((id) => {
    setDecisions((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const saveReview = useCallback((id, review) => {
    setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, review } : d)))
  }, [])

  const resetDemoData = useCallback(() => {
    setDecisions(buildSampleData())
  }, [])

  return { decisions, addDecision, updateDecision, deleteDecision, saveReview, resetDemoData }
}
