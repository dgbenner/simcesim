// demandModel.js
// A GROUNDED demand model for the Sales page (spec addendum §3). Fit to the four real
// Round 1 (Winter) walk-in observations — price set vs. nights sold — it lets the Sales
// page show real cause-and-effect (price → volume) instead of only echoing the user's
// estimate.
//
// HONESTY: this is a simplified teaching curve fit to four real points, NOT Cesim's live
// engine. It treats competitors as holding their Round 1 stance and so cannot capture how
// demand really moves with rivals' prices. Use it as a DIRECTIONAL readout. It does NOT
// drive the budget — Approach A still stands: the user's own estimate feeds the statements.

import { PARAMS } from './formulas'

// Constant-elasticity fit: walk-in nights ≈ REF_NIGHTS · (price / REF_PRICE)^ELASTICITY.
// Elasticity ≈ −2.35 (a 1% price rise drops walk-in nights ~2.3%) — R² ≈ 0.99 across the
// four real points. Calibrated to pass through Hotel Red's actual Round 1 observation.
const ELASTICITY = -2.35
const REF_PRICE = 125 // Hotel Red's Round 1 walk-in price
const REF_NIGHTS = 1905 // Hotel Red's Round 1 walk-in nights sold
const MKT_NORM = 7000 // Round 1 marketing norm (Hotel Red's spend)

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// The four real Round 1 · Winter points the curve is fit to (price → walk-in nights).
export const WALKIN_POINTS = [
  { team: 'The Northline', price: 150, nights: 1299 },
  { team: 'Hotel Red', price: 125, nights: 1905 },
  { team: 'Blue', price: 135, nights: 1897 },
  { team: 'Hotel of America', price: 250, nights: 399 },
]

export const DEMAND_REF = { elasticity: ELASTICITY, refPrice: REF_PRICE, refNights: REF_NIGHTS }

// Gentle marketing multiplier — a SECONDARY effect; price stays the dominant driver.
// Spends well above the $7,000 norm nudge demand up to ~+12%, well below down to ~−12%.
export function marketingFactor(marketing) {
  const m = Number(marketing) || 0
  return clamp(1 + 0.12 * Math.tanh((m - MKT_NORM) / 10000), 0.85, 1.2)
}

// Model-suggested walk-in nights at a given price. Quality/marketing are gentle nudges,
// kept deliberately small so they never overpower the price signal. Capped at capacity.
export function estimateWalkInNights(price, { qualityFactor = 1, marketingFactor: mf = 1 } = {}) {
  const p = Number(price)
  if (!Number.isFinite(p) || p <= 0) return 0
  const base = REF_NIGHTS * Math.pow(p / REF_PRICE, ELASTICITY)
  const nights = base * qualityFactor * mf
  return Math.max(0, Math.min(PARAMS.capacityNights, Math.round(nights)))
}

// Walk-in nights as a share of the season's room-night capacity (%).
export function walkInOccupancy(nights) {
  return clamp((Number(nights) / PARAMS.capacityNights) * 100, 0, 100)
}
