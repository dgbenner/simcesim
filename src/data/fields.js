// FIELD CATALOG — the single source of truth for every user-editable decision.
//
// Each field carries everything the three overlay layers need:
//   • unit / min / max / default / step  → rendered ON the field (spec §7)
//   • help                               → the info-icon (ⓘ) tooltip + dock text
//   • boundsWhy                          → modal: "why this bound exists" (spec §9.2)
//   • effects[]                          → modal: cause-and-effect, directional (spec §9.3)
//
// Everything NOT listed here is a read-only readout (computed/displayed), not a decision.
// `ghosted` fields are shown but inactive (out of scope for the cohort's learning).
// `kind: 'estimation'` fields feed the budget/projection only — they do NOT change
// actual results (Approach A; see the honesty boundary in spec §1).

/** @typedef {{dir: '+'|'-'|'~', text: string}} Effect */

export const PAGES = {
  sales: 'Sales',
  operations: 'Operations',
  finance: 'Finance',
}

// Capacity ceiling used by Sales bounds. 50 rooms × 180 nights = 9,000 nights/season.
export const CAPACITY_NIGHTS = 9000

export const FIELDS = {
  // ─────────────────────────────────────── SALES ───────────────────────────────────────
  walkInRate: {
    id: 'walkInRate',
    page: 'sales',
    section: 'Walk-in sales',
    label: 'Walk-in room rate',
    kind: 'decision',
    unit: '$',
    min: 0,
    max: 1000,
    step: 1,
    default: '',
    help: 'The nightly rate you charge individuals who book during the season. Your main pricing lever.',
    boundsWhy:
      '$0 to $1,000 per night. This is the rate walk-in guests pay per room-night. There is no hard business reason for the $1,000 ceiling beyond a sane upper guard — realistic rates sit far below it.',
    effects: [
      { dir: '+', text: 'Revenue per filled night rises.' },
      { dir: '-', text: 'In the live system, nights sold likely falls — price competes against rivals.' },
      { dir: '~', text: 'Business travelers (winter) are less price-sensitive than leisure (summer).' },
      { dir: '~', text: 'In SIMCesim, actual nights come from your estimate below — actual demand resolves only in the live system.' },
    ],
  },
  estNightsSold: {
    id: 'estNightsSold',
    page: 'sales',
    section: 'Walk-in sales',
    label: 'Estimated walk-in nights sold',
    kind: 'estimation',
    unit: 'nights',
    min: 0,
    max: 7130, // capacity ceiling confirmed live
    step: 1,
    default: '',
    help: "Your forecast of this season's walk-in room-nights. In this tool it drives everything downstream — revenue, occupancy, and profit all compute from it (open Projections). The real Cesim resolves actual demand live against competitors; this version stands in with your estimate.",
    boundsWhy:
      '0 to 7,130 nights — a capacity-bounded ceiling. This counts WALK-IN nights this season only (advance/agency sales below are for future seasons). It is an ESTIMATION cell: it drives the budgeted income statement only. In the live system the real number resolves at the deadline against competitors; here, everything downstream computes from this estimate (Approach A).',
    effects: [
      { dir: '+', text: 'Projected sales revenue rises (rate × nights).' },
      { dir: '+', text: 'Projected direct cost rises (per-night cost × nights).' },
      { dir: '~', text: 'Does not change actual results — it is a forecast input, not a decision.' },
    ],
  },
  advanceNextSeason: {
    id: 'advanceNextSeason',
    page: 'sales',
    section: 'Advance sales to travel agencies',
    label: 'Nights offered to agencies — next season (summer)',
    kind: 'decision',
    unit: 'nights',
    min: 0,
    max: 2948, // min(capacity 9,000, agency cap ≈2,948) — agency cap is dynamic
    step: 1,
    default: 0,
    help: 'Room-nights you pre-sell now to travel agencies for NEXT season. (Original mislabels this "Nights sold this season.")',
    boundsWhy:
      "0 to ~2,948 nights — the lesser of your 9,000-night capacity and the nights travel agencies are willing to buy at the offered terms. The agency cap is a dynamic, demand-side limit, not a fixed number: \"You can't sell more than your capacity of 9,000 nights or the nights that travel agencies are willing to buy.\"",
    effects: [
      { dir: '-', text: 'Price per night falls as volume rises (agencies pay less the more you push).' },
      { dir: '~', text: 'Trades against the two-seasons-ahead window — selling a lot there depresses this one.' },
      { dir: '+', text: 'Locks in future occupancy now, smoothing seasonal demand.' },
    ],
  },
  advanceTwoSeasons: {
    id: 'advanceTwoSeasons',
    page: 'sales',
    section: 'Advance sales to travel agencies',
    label: 'Nights offered to agencies — two seasons ahead (winter)',
    kind: 'decision',
    unit: 'nights',
    min: 0,
    max: 2860, // min(capacity 9,000, agency cap ≈2,860)
    step: 1,
    default: 0,
    help: 'Room-nights you pre-sell now to travel agencies for the season TWO ahead. Same structure as the next-season window, different agency cap.',
    boundsWhy:
      '0 to ~2,860 nights — again the lesser of capacity and what agencies will buy two seasons out. The cap differs from the next-season window because agency demand for the further-out season is different.',
    effects: [
      { dir: '-', text: 'Price per night falls as volume rises (volume discount).' },
      { dir: '~', text: 'Trades against the next-season window — the two compete for the same rooms.' },
    ],
  },
  marketing: {
    id: 'marketing',
    page: 'sales',
    section: 'Walk-in sales',
    label: 'Marketing',
    kind: 'decision',
    unit: '$',
    min: 0,
    max: 1000000,
    step: 100,
    default: 7000,
    help: 'Marketing spend for the season. Drives walk-in demand more than advance, and lifts advance prices somewhat.',
    boundsWhy:
      '$0 to $1,000,000. This is the same figure shown on the income statement — one decision, mirrored into the statement view, not a second input.',
    effects: [
      { dir: '+', text: 'Walk-in demand rises (more than advance demand).' },
      { dir: '+', text: 'Advance prices rise somewhat.' },
      { dir: '-', text: 'Operating cost rises on the income statement.' },
      { dir: '~', text: 'Very low variable cost per night means filling otherwise-empty rooms is high-contribution.' },
    ],
  },

  // ──────────────────────────────────── OPERATIONS ────────────────────────────────────
  capacityChange: {
    id: 'capacityChange',
    page: 'operations',
    section: 'Investments',
    label: 'Change in room capacity',
    kind: 'decision',
    control: 'dropdown',
    unit: 'rooms',
    step: 5, // sold in sets of 5
    default: 0,
    ghosted: true,
    help: 'Buying (or selling) rooms in sets of 5. Out of scope for this cohort — there is no demand growth to build for, so this is disabled.',
    boundsWhy:
      'Capacity expands in sets of 5 rooms. Ghosted in SIMCesim: building capacity only pays off if there is demand to fill it, and demand growth is out of scope for the course.',
    effects: [
      { dir: '+', text: 'Total room-night capacity rises (5 rooms × 180 nights per set).' },
      { dir: '-', text: 'Capital expenditure and depreciation rise.' },
    ],
  },
  maintenance: {
    id: 'maintenance',
    page: 'operations',
    section: 'Condition and maintenance',
    label: 'Maintenance and renovation',
    kind: 'decision',
    unit: '$',
    min: 0,
    max: 1000000,
    step: 250,
    default: 18750,
    help: 'Spend that keeps up and improves the facility. Raises facility condition, which feeds Quality Level.',
    boundsWhy:
      '$0 to $1,000,000. Under-spend and the facility condition decays; over-spend hits diminishing returns.',
    effects: [
      { dir: '+', text: 'Facility condition rises → Quality Level rises.' },
      { dir: '+', text: 'Demand and the price you can command get support.' },
      { dir: '-', text: 'Operating cost rises now.' },
    ],
  },
  directCostSaving: {
    id: 'directCostSaving',
    page: 'operations',
    section: 'Cost saving efforts',
    label: 'Direct cost saving effort',
    kind: 'decision',
    unit: '$',
    min: 0,
    max: 1000000,
    step: 250,
    default: 5000,
    help: 'Spend now to reduce per-night direct cost. The saving is cumulative across rounds.',
    boundsWhy: '$0 to $1,000,000. Spend buys a recurring reduction in per-night direct cost that carries forward.',
    effects: [
      { dir: '-', text: 'Per-night direct cost falls (cumulative across rounds).' },
      { dir: '-', text: 'Operating cost rises now (you pay for the effort up front).' },
    ],
  },
  adminCostSaving: {
    id: 'adminCostSaving',
    page: 'operations',
    section: 'Cost saving efforts',
    label: 'Administration cost saving effort',
    kind: 'decision',
    unit: '$',
    min: 0,
    max: 1000000,
    step: 250,
    default: 3000,
    help: 'Spend now to reduce the fixed administration line. Cumulative across rounds.',
    boundsWhy: '$0 to $1,000,000. Buys a recurring reduction in the fixed admin cost line.',
    effects: [
      { dir: '-', text: 'Fixed administration line falls (cumulative).' },
      { dir: '-', text: 'Operating cost rises now.' },
    ],
  },
  turnover: {
    id: 'turnover',
    page: 'operations',
    section: 'Personnel',
    label: 'Personnel turnover (estimation)',
    kind: 'estimation',
    unit: '%',
    min: 0,
    max: 100,
    step: 0.1,
    default: 10.0,
    help: 'Your estimate of the share of staff leaving and being replaced. Driven partly by wage and training, partly by factors outside your control.',
    boundsWhy:
      'A percentage estimate. This is an ESTIMATION cell — it informs the budget but does not itself set personnel cost; wage and training influence the real figure.',
    effects: [
      { dir: '~', text: 'Higher turnover means more new hires → lower average competence.' },
      { dir: '~', text: 'Influenced down by higher wages and training; partly uncontrollable.' },
    ],
  },
  headcount: {
    id: 'headcount',
    page: 'operations',
    section: 'Personnel',
    label: 'Personnel this period',
    kind: 'decision',
    unit: '# people',
    min: 2,
    max: 100,
    step: 0.25, // part-time allowed (decimals)
    default: 4.0,
    help: 'Permanent headcount for the period. Part-time is allowed, so decimals are valid. Minimum 2 is a real floor.',
    boundsWhy:
      '2 to 100 people. Decimals are allowed because part-time staff count as fractions. The minimum of 2 is a genuine operating floor — you cannot run the hotel below it.',
    effects: [
      { dir: '+', text: 'Personnel expense rises; recruitment cost rises if hiring.' },
      { dir: '-', text: 'Cutting incurs layoff cost — asymmetric: layoff $12,000/person vs recruit $4,000/person.' },
      { dir: '~', text: 'Understaffing raises personnel stress and can hurt quality.' },
    ],
  },
  wage: {
    id: 'wage',
    page: 'operations',
    section: 'Personnel',
    label: 'Wage / month',
    kind: 'decision',
    unit: '$/month',
    min: 0,
    max: 100000,
    step: 50,
    default: 3000,
    help: 'Monthly wage per permanent employee. Affects turnover and the competence of new hires.',
    boundsWhy:
      'Monthly per-employee wage. (The live tool did not surface an explicit ceiling — treat realistic market wages as the practical range.)',
    effects: [
      { dir: '-', text: 'Turnover falls (better pay retains staff).' },
      { dir: '+', text: 'Competence of new hires rises (you attract better people).' },
      { dir: '-', text: 'Personnel expense rises.' },
    ],
  },
  training: {
    id: 'training',
    page: 'operations',
    section: 'Training',
    label: 'Training budget per person',
    kind: 'decision',
    unit: '$/person',
    min: 0,
    max: 10000,
    step: 50,
    default: 1000,
    help: 'Training spend per employee. Buys competence, which feeds Quality Level. Diminishing returns.',
    boundsWhy: '$0 to $10,000 per person. Above a point the competence gain per dollar shrinks (diminishing returns).',
    effects: [
      { dir: '+', text: 'Competence rises → personnel quality rises → Quality Level rises.' },
      { dir: '-', text: 'Operating cost rises now; gains taper at high spend.' },
    ],
  },

  // ───────────────────────────────────── FINANCE ─────────────────────────────────────
  ltLoanChange: {
    id: 'ltLoanChange',
    page: 'finance',
    section: 'Financing',
    label: 'Changes in long-term loans',
    kind: 'decision',
    unit: '$',
    min: -3345725,
    max: 10000000,
    step: 1000,
    default: 0,
    help: 'Take on new long-term debt (positive) or repay existing debt (negative).',
    boundsWhy:
      '−$3,345,725 to $10,000,000. The negative floor is your current outstanding balance — you cannot repay more than the $3,345,725 you currently owe.',
    effects: [
      { dir: '+', text: 'Cash rises now (if borrowing).' },
      { dir: '-', text: 'Interest expense rises; gearing rises → more financial risk → higher company-specific prime rate over time.' },
    ],
  },
  dividends: {
    id: 'dividends',
    page: 'finance',
    section: 'Financing',
    label: 'Dividends paid',
    kind: 'decision',
    unit: '$',
    min: 0,
    max: 823387,
    step: 1000,
    default: 0,
    help: 'Cash paid out to shareholders. The owner expects a steady dividend stream.',
    boundsWhy:
      '$0 to $823,387 — the cap is your available retained earnings. Dividends can only be paid out of retained earnings, not borrowed cash.',
    effects: [
      { dir: '-', text: 'Retained earnings fall; cash falls.' },
      { dir: '+', text: 'Satisfies the owner, who expects a steady dividend stream (case description).' },
    ],
  },
  creditTerm: {
    id: 'creditTerm',
    page: 'finance',
    section: 'Financing',
    label: 'Credit term',
    kind: 'decision',
    unit: 'days',
    min: 0,
    max: 180,
    step: 1,
    default: 30,
    help: 'How many days you let travel agencies wait before paying. Longer terms tie up more cash in receivables.',
    boundsWhy:
      '0 to 180 days — this is how long you let agencies wait to pay. Longer terms tie up more cash in trade receivables, but can help win advance sales.',
    effects: [
      { dir: '+', text: 'Trade receivables rise (capital tied up).' },
      { dir: '+', text: 'Can support advance sales — agencies favor generous terms.' },
    ],
  },
}

// Editable (non-ghosted) decisions, in dependency order: Sales → Operations → Finance.
// This is the set the decision-loop strip counts and steps through (spec §6/§7).
export const DECISION_ORDER = [
  // Sales first (demand / price / marketing)
  'walkInRate',
  'estNightsSold',
  'advanceNextSeason',
  'advanceTwoSeasons',
  'marketing',
  // Operations next (size personnel & maintenance to that demand)
  'maintenance',
  'directCostSaving',
  'adminCostSaving',
  'turnover',
  'headcount',
  'wage',
  'training',
  // Finance last (loans / dividends / credit term)
  'ltLoanChange',
  'dividends',
  'creditTerm',
]

export const fieldsForPage = (page) =>
  Object.values(FIELDS).filter((f) => f.page === page)
