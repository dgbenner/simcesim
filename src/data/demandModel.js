// demandModel.js
// A SEASON-AWARE demand model for the Sales page (spec addendum §2 — supersedes the old
// single-curve model). Fit to the real walk-in observations across all three rounds:
// price → nights, per season. It lets the Sales page show real cause-and-effect (price
// drives volume) instead of only echoing the user's estimate.
//
// HONESTY: this is a DIRECTIONAL teaching approximation, NOT Cesim's live engine and NOT a
// predictor. The slope itself shifts season to season, and real demand also moves with
// competitors' prices, which resolve only in the live simulation. It does NOT drive the
// budget — Approach A stands: the user's own estimate feeds the statements.
//
// What's reliable (safe to build on): price is the dominant lever and the price→nights
// relationship is ALWAYS negative; winter demand is more price-sensitive than summer.

import { PARAMS } from './formulas'

// Per-season elasticity, fit to real rounds. Winter blended from R1 (−2.35) and R3 (−0.89);
// Summer from R2 (−0.95). Reference point per season is a real Hotel Red round of that type.
const ELASTICITY = { winter: -1.6, summer: -0.95 }
const REF = {
  winter: { price: 130, nights: 1710 }, // Hotel Red, Round 3 (winter)
  summer: { price: 135, nights: 2056 }, // Hotel Red, Round 2 (summer)
}
const MKT_NORM = 9000 // ~marketing norm across recent rounds (Hotel Red R2/R3 ≈ $11.2k, R1 $7k)

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const norm = (season) => (season === 'winter' ? 'winter' : 'summer')

// The real per-round walk-in observations (price → walk-in nights), for context/labels.
export const WALKIN_POINTS = {
  winter: [
    { round: 1, team: 'Hotel Red', price: 125, nights: 1905 },
    { round: 3, team: 'Hotel Red', price: 130, nights: 1710 },
    { round: 1, team: 'Hotel America', price: 250, nights: 399 },
  ],
  summer: [
    { round: 2, team: 'Hotel Red', price: 135, nights: 2056 },
    { round: 2, team: 'Blue', price: 170, nights: 1647 },
    { round: 2, team: 'Hotel America', price: 100, nights: 2687 },
  ],
}

export const demandRefFor = (season) => ({ elasticity: ELASTICITY[norm(season)], ...REF[norm(season)] })

// Gentle marketing multiplier — a SECONDARY effect; price stays the dominant driver.
export function marketingFactor(marketing) {
  const m = Number(marketing) || 0
  return clamp(1 + 0.12 * Math.tanh((m - MKT_NORM) / 12000), 0.85, 1.2)
}

// Model-suggested walk-in nights at a given price, for the given season. Quality/marketing
// are gentle nudges, kept small so they never overpower the price signal. Capped at capacity.
export function estimateWalkInNights(price, season, { qualityFactor = 1, marketingFactor: mf = 1 } = {}) {
  const p = Number(price)
  if (!Number.isFinite(p) || p <= 0) return 0
  const e = ELASTICITY[norm(season)]
  const ref = REF[norm(season)]
  const base = ref.nights * Math.pow(p / ref.price, e)
  const nights = base * qualityFactor * mf
  return Math.max(0, Math.min(PARAMS.capacityNights, Math.round(nights)))
}

// Walk-in nights as a share of the season's room-night capacity (%).
export function walkInOccupancy(nights) {
  return clamp((Number(nights) / PARAMS.capacityNights) * 100, 0, 100)
}
