// config.js — single source of truth for which round is live/editable.
// Bump CURRENT_ROUND by one each time a new round export arrives (then re-run
// scripts/build-round-results.mjs to seed its data). The just-finished round becomes
// review-only; the new round becomes the editable sandbox.

export const CURRENT_ROUND = 4 // the only EDITABLE round (Round 4 · Summer, live)
export const CURRENT_DEADLINE = '2026-06-16 13:05'

// Seasons alternate: odd rounds = Winter, even = Summer (confirmed from the real exports).
export const seasonOfRound = (n) => (n % 2 === 1 ? 'winter' : 'summer')

export const CURRENT_SEASON = seasonOfRound(CURRENT_ROUND) // 'summer'
export const LAST_COMPLETED_ROUND = CURRENT_ROUND - 1 // 3 (the past-results anchor)

// Editability gate: only the current round accepts input; earlier rounds are review-only.
export const isRoundEditable = (n) => n === CURRENT_ROUND
