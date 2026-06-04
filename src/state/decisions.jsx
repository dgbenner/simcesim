/* eslint-disable react-refresh/only-export-components -- provider + hook co-located by design */
import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { FIELDS, DECISION_ORDER } from '../data/fields'
import { computeProjection } from '../data/formulas'

// In-memory decision store (spec §2: React state only, no persistence in v1).
// Seeds every field from its catalog default; recomputes the projection on change.
//
// "Made" vs "has a value": defaults are pre-filled, so a value alone doesn't mean the
// user decided anything. We track a `touched` set — a decision counts as MADE once the
// user has engaged the field (focused it or changed it). A refresh starts clean.

const SEASON = 'summer' // Round 2 is summer (active round)

// Editable (non-ghosted) decisions, in dependency order — the set we count + sequence.
export const EDITABLE_IDS = DECISION_ORDER.filter((id) => !FIELDS[id].ghosted)

function initialValues() {
  const v = {}
  for (const f of Object.values(FIELDS)) v[f.id] = f.default
  return v
}

const DecisionsContext = createContext(null)

export function DecisionsProvider({ children }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState(() => new Set())

  const markTouched = useCallback((id) => {
    setTouched((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  const setValue = useCallback(
    (id, value) => {
      setValues((prev) => ({ ...prev, [id]: value }))
      markTouched(id) // changing a value is engaging the decision
    },
    [markTouched],
  )

  const reset = useCallback(() => {
    setValues(initialValues())
    setTouched(new Set())
  }, [])

  const projection = useMemo(() => computeProjection(values, SEASON), [values])

  // Overall progress for the strip: editable decisions the user has actually made.
  const progress = useMemo(
    () => ({
      made: EDITABLE_IDS.filter((id) => touched.has(id)).length,
      total: EDITABLE_IDS.length,
    }),
    [touched],
  )

  const value = useMemo(
    () => ({ values, setValue, markTouched, touched, reset, projection, progress, season: SEASON }),
    [values, setValue, markTouched, touched, reset, projection, progress],
  )

  return <DecisionsContext.Provider value={value}>{children}</DecisionsContext.Provider>
}

export function useDecisions() {
  const ctx = useContext(DecisionsContext)
  if (!ctx) throw new Error('useDecisions must be used within DecisionsProvider')
  return ctx
}
