/* eslint-disable react-refresh/only-export-components -- provider + hook co-located by design */
import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { FIELDS, DECISION_ORDER } from '../data/fields'
import { computeProjection } from '../data/formulas'
import { CURRENT_ROUND, seasonOfRound } from '../data/config'
import { PAST_DECISIONS } from '../data/roundResults'
import { useUI } from './ui'

// In-memory decision store (spec §2: React state only, no persistence in v1).
//
// The CURRENT round (config.CURRENT_ROUND) is the editable sandbox: every field seeds from
// its catalog default and the projection recomputes on change. PAST rounds are REVIEW-ONLY:
// the store swaps in that round's actual Hotel Red decisions (from the real export, via
// PAST_DECISIONS) and reports read-only — inputs are locked, the season follows the round.
//
// "Made" vs "has a value": on the current round, defaults are pre-filled, so a value alone
// doesn't mean the user decided anything — a decision counts as MADE once the user SETS a
// non-empty value (tracked in `changed`). On a past round, the decisions we have from the
// export are shown as already made.

// Editable (non-ghosted) decisions, in dependency order — the set we count + sequence.
export const EDITABLE_IDS = DECISION_ORDER.filter((id) => !FIELDS[id].ghosted)

const isFilled = (v) => v !== '' && v !== null && v !== undefined

function initialValues() {
  const v = {}
  for (const f of Object.values(FIELDS)) v[f.id] = f.default
  return v
}

// Blank base (every field empty) — past rounds fill in only what the export actually
// recorded; the rest show "—" and count as 0 in the projection.
function blankValues() {
  const v = {}
  for (const f of Object.values(FIELDS)) v[f.id] = ''
  return v
}

const DecisionsContext = createContext(null)

export function DecisionsProvider({ children }) {
  const { decisionRound } = useUI()
  const readOnly = decisionRound !== CURRENT_ROUND
  const season = seasonOfRound(decisionRound)

  // Live sandbox state for the current (editable) round.
  const [liveValues, setLiveValues] = useState(initialValues)
  const [changed, setChanged] = useState(() => new Set())

  const setValue = useCallback(
    (id, value) => {
      if (readOnly) return // past rounds are locked
      setLiveValues((prev) => ({ ...prev, [id]: value }))
      setChanged((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
    },
    [readOnly],
  )

  const reset = useCallback(() => {
    if (readOnly) return
    setLiveValues(initialValues())
    setChanged(new Set())
  }, [readOnly])

  // What this round's decisions actually were (locked) vs. the live sandbox.
  const pastValues = useMemo(
    () => (readOnly ? { ...blankValues(), ...(PAST_DECISIONS[decisionRound] || {}) } : null),
    [readOnly, decisionRound],
  )
  const values = readOnly ? pastValues : liveValues

  const projection = useMemo(() => computeProjection(values, season), [values, season])

  // On a past round, the decisions we have from the export count as made. On the current
  // round, a decision is "made" once the user has edited it AND it holds a value.
  const made = useMemo(() => {
    const s = new Set()
    if (readOnly) {
      const pd = PAST_DECISIONS[decisionRound] || {}
      for (const id of EDITABLE_IDS) if (isFilled(pd[id])) s.add(id)
      return s
    }
    for (const id of EDITABLE_IDS) {
      if (changed.has(id) && isFilled(liveValues[id])) s.add(id)
    }
    return s
  }, [readOnly, decisionRound, changed, liveValues])

  const progress = useMemo(() => ({ made: made.size, total: EDITABLE_IDS.length }), [made])

  const value = useMemo(
    () => ({ values, setValue, made, reset, projection, progress, season, readOnly, round: decisionRound }),
    [values, setValue, made, reset, projection, progress, season, readOnly, decisionRound],
  )

  return <DecisionsContext.Provider value={value}>{children}</DecisionsContext.Provider>
}

export function useDecisions() {
  const ctx = useContext(DecisionsContext)
  if (!ctx) throw new Error('useDecisions must be used within DecisionsProvider')
  return ctx
}
