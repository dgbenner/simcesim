/* eslint-disable react-refresh/only-export-components -- provider + hook co-located by design */
import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { FIELDS, DECISION_ORDER } from '../data/fields'
import { computeProjection } from '../data/formulas'
import { CURRENT_SEASON } from '../data/config'

// In-memory decision store (spec §2: React state only, no persistence in v1).
// Seeds every field from its catalog default; recomputes the projection on change.
//
// "Made" vs "has a value": defaults are pre-filled, so a value alone doesn't mean the
// user decided anything. A decision counts as MADE once the user has SET A NON-EMPTY
// VALUE in it (changing it via input or modal) — NOT merely focusing it, and NOT the
// pre-filled default. `changed` records which fields the user has edited; `made` is the
// subset of those that currently hold a value. A refresh starts clean.

const SEASON = CURRENT_SEASON // current editable round's season (Round 4 · Summer) — from config.js

// Editable (non-ghosted) decisions, in dependency order — the set we count + sequence.
export const EDITABLE_IDS = DECISION_ORDER.filter((id) => !FIELDS[id].ghosted)

const isFilled = (v) => v !== '' && v !== null && v !== undefined

function initialValues() {
  const v = {}
  for (const f of Object.values(FIELDS)) v[f.id] = f.default
  return v
}

const DecisionsContext = createContext(null)

export function DecisionsProvider({ children }) {
  const [values, setValues] = useState(initialValues)
  const [changed, setChanged] = useState(() => new Set())

  const setValue = useCallback((id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }))
    setChanged((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues())
    setChanged(new Set())
  }, [])

  const projection = useMemo(() => computeProjection(values, SEASON), [values])

  // A decision is "made" once the user has edited it AND it holds a value.
  const made = useMemo(() => {
    const s = new Set()
    for (const id of EDITABLE_IDS) {
      if (changed.has(id) && isFilled(values[id])) s.add(id)
    }
    return s
  }, [changed, values])

  const progress = useMemo(
    () => ({ made: made.size, total: EDITABLE_IDS.length }),
    [made],
  )

  const value = useMemo(
    () => ({ values, setValue, made, reset, projection, progress, season: SEASON }),
    [values, setValue, made, reset, projection, progress],
  )

  return <DecisionsContext.Provider value={value}>{children}</DecisionsContext.Provider>
}

export function useDecisions() {
  const ctx = useContext(DecisionsContext)
  if (!ctx) throw new Error('useDecisions must be used within DecisionsProvider')
  return ctx
}
