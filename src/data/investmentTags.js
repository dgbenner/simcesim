// investmentTags.js
// SIMCesim investment-horizon tags.
//
// Adds a horizon tag to the decision fields where spending now pays back LATER.
// Applied CONSERVATIVELY — only where a field genuinely commits money across rounds.
// Fields left out carry NO horizon tag; the absence implies a single-round decision
// (pricing, forecasts, payouts, this-round-only choices). Do not tag those.
//
// Two tags:
//   SHRT-INV  Short-term investment — pays back within ~1–3 rounds.
//   LNG-INV   Long-term investment  — pays back / compounds over ~4+ rounds.
//
// These sit alongside the existing tags (e.g. "decision", "forecast"). A field may
// carry an existing tag AND a horizon tag (e.g. marketing is a decision + LNG-INV).
//
// Keys are remapped to the real field ids in fields.js (the source used camelCase
// guesses, e.g. advanceSalesNextSeason → advanceNextSeason, permanentEmployees → headcount).

export const investmentTags = {
  // ── SHORT-TERM investments (~1–3 rounds) ─────────────────────────────────────
  advanceNextSeason: 'SHRT-INV', // locks in revenue ~1 round out
  advanceTwoSeasons: 'SHRT-INV', // locks in revenue ~2 rounds out
  temporaryEmployees: 'SHRT-INV', // flexed per season — no temp field in v1 yet (unused, kept)
  creditTerm: 'SHRT-INV', // shifts this round's receivables / cash

  // ── LONG-TERM investments (~4+ rounds, or compounding) ───────────────────────
  marketing: 'LNG-INV', // short-term lift + lingering multi-round effect
  maintenance: 'LNG-INV', // raises facility condition; compounds into quality
  directCostSaving: 'LNG-INV', // cumulative cost reduction across rounds
  adminCostSaving: 'LNG-INV', // cumulative cost reduction across rounds
  headcount: 'LNG-INV', // standing commitment; competence builds over rounds
  wage: 'LNG-INV', // drives turnover + competence, which compound
  training: 'LNG-INV', // builds competence over this + prior periods
  ltLoanChange: 'LNG-INV', // multi-round financing commitment

  // ── INTENTIONALLY UNTAGGED (single-round / not an investment) ────────────────
  // walkInRate     — pricing decision, this round only
  // estNightsSold  — forecast/estimation (carries the "forecast" tag instead)
  // turnover       — forecast/estimation
  // dividends      — payout, not an investment
}

// Tag metadata for rendering the chip and the right-hand legend. `variant` maps to the
// shared <Tag> component's variants.
export const investmentTagMeta = {
  'SHRT-INV': {
    label: 'SHRT-INV',
    variant: 'shrtInv',
    name: 'Short-term investment',
    timeframe: 'Pays back within about 1–3 rounds.',
    legend:
      'Money spent now that you expect to earn back over the next one to three rounds. ' +
      'Useful for near-term moves like locking in upcoming bookings or flexing seasonal ' +
      'staff.',
  },
  'LNG-INV': {
    label: 'LNG-INV',
    variant: 'lngInv',
    name: 'Long-term investment',
    timeframe: 'Pays back or compounds over roughly 4+ rounds.',
    legend:
      'Money spent now whose payoff builds slowly across many rounds. Things like ' +
      'maintenance, training, cost-saving, and your permanent team raise quality and ' +
      'lower costs that compound season after season.',
  },
}

// Untagged note for the legend (explains the ABSENCE of a horizon tag).
export const untaggedHorizonNote =
  'Fields with no horizon tag are single-round decisions — pricing, forecasts, and ' +
  'payouts that affect this round only.'

// Helper: get the horizon tag for a field (or null if untagged).
export function horizonTagFor(fieldKey) {
  return investmentTags[fieldKey] || null
}
