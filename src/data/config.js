// config.js — single source of truth for rounds + which one is editable.
//
// The 7-round game is COMPLETE: rounds 1–7 are all real, review-only (data in
// roundResults.js). The editable experience is a separate, explicitly-labeled SANDBOX round
// — a practice playground (Summer) that starts from defaults and never claims to be real.

export const COMPLETED_ROUND_COUNT = 7

// The Sandbox is a synthetic round id past the real ones. Even id → Summer season, so the
// season-aware demand model + labels work without special-casing.
export const SANDBOX_ROUND = 8

// The "editable round" the rest of the app keys off. It IS the sandbox now.
export const CURRENT_ROUND = SANDBOX_ROUND

// Seasons alternate: odd rounds = Winter, even = Summer (confirmed from the real exports).
export const seasonOfRound = (n) => (n % 2 === 1 ? 'winter' : 'summer')

export const CURRENT_SEASON = seasonOfRound(SANDBOX_ROUND) // 'summer' — the sandbox season
export const LAST_COMPLETED_ROUND = COMPLETED_ROUND_COUNT // 7 — most recent real round (anchor)

export const isSandbox = (n) => n === SANDBOX_ROUND
// Editability gate: only the sandbox accepts input; the seven real rounds are review-only.
export const isRoundEditable = (n) => n === SANDBOX_ROUND

// One consistent label everywhere: real rounds read "Round N · Season"; the sandbox reads
// "Sandbox" (a practice round, no real-round number on display).
export const roundLabel = (n) =>
  n === SANDBOX_ROUND ? 'Sandbox' : `Round ${n} · ${seasonOfRound(n) === 'winter' ? 'Winter' : 'Summer'}`
