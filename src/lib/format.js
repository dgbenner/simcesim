// Formatting helpers. All money is USD (spec §3) — the original mislabels with €.

const n0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const n2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Currency: whole dollars, with sign. Negative shown with a minus, not parentheses.
export const usd = (v) => {
  const n = Number(v) || 0
  return `$${n0.format(Math.round(n))}`
}

// Plain integer (e.g. room-nights).
export const int = (v) => n0.format(Math.round(Number(v) || 0))

// Percent with one decimal.
export const pct = (v, digits = 1) => `${(Number(v) || 0).toFixed(digits)}%`

// Two-decimal number (e.g. headcount, EPS).
export const dec2 = (v) => n2.format(Number(v) || 0)

// Compact money for tight readouts ($1.2M).
export const usdShort = (v) => {
  const n = Number(v) || 0
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 10_000) return `$${(n / 1000).toFixed(0)}k`
  return usd(n)
}
