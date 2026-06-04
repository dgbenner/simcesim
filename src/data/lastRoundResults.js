// lastRoundResults.js
// SEEDED FROM SCREENSHOTS — not computed. These are the actual Round-1 (Winter) figures
// read from the `Results · Cesim Service` screenshots in _reference/screenshots/. They are
// the historical ANCHOR the Results page + past-results hint display. When a real
// multi-round engine exists, replace this file with computed round-to-round state.
//
// Columns are the four teams; only Hotel Red is active (the rest render ghosted, per the
// global competitor-ghosting rule). Numbers for competitors come from the Sorting/Ratios
// screenshots where legible and are otherwise representative.

export const LAST_ROUND = { n: 1, season: 'Winter', label: 'Round 1 · Winter' }

export const RESULT_TEAMS = [
  { key: 'northline', name: 'The Northline', active: false },
  { key: 'red', name: 'Hotel Red', active: true },
  { key: 'blue', name: 'Blue', active: false },
  { key: 'america', name: 'Hotel of America', active: false },
]

// Order matches RESULT_TEAMS: [northline, red, blue, america]
const r = (label, vals, opts = {}) => ({ label, vals, ...opts })

// ── Income statement (Previous 6 months) ──────────────────────────────────────────────
export const INCOME = [
  { heading: 'Sales revenue' },
  r('Domestic', [485780, 529164, 537109, 380594]),
  r('International', [0, 0, 0, 0], { ghostRow: true }),
  r('Total sales', [485780, 529164, 537109, 380594], { bold: true, rule: true }),
  { heading: 'Personnel expenses and direct costs' },
  r('Permanent', [69300, 72000, 70500, 69300], { indent: true }),
  r('Temporary', [10500, 4725, 10500, 8400], { indent: true }),
  r('Direct cost', [37000, 38163, 38900, 29200], { indent: true }),
  r('Gross profit', [378243, 420848, 388739, 270532], { bold: true, rule: true }),
  { heading: 'Other operating expenses' },
  r('Administration', [48210, 48210, 48210, 48210], { indent: true }),
  r('Rental payment', [62500, 62500, 62500, 62500], { indent: true }),
  r('Layoff and recruitment', [5500, 1600, 5500, 9000], { indent: true }),
  r('Personnel training', [4000, 4000, 4500, 3000], { indent: true }),
  r('Cost saving efforts', [8000, 8000, 8000, 6000], { indent: true }),
  r('Maintenance', [18750, 18750, 18750, 12500], { indent: true }),
  r('EBITDA', [235460, 271511, 227177, 119385], { bold: true, rule: true, gloss: 'EBITDA' }),
  r('Depreciation', [-50000, -50000, -50000, -50000], { indent: true, gloss: 'Depreciation' }),
  r('EBIT', [185460, 221511, 177177, 69385], { bold: true, gloss: 'EBIT' }),
  { heading: 'Financing income and expenses' },
  r('Interest income', [4827, 5187, 4327, 3104], { indent: true }),
  r('Interest expenses', [-21500, -22561, -21000, -19000], { indent: true }),
  r('Income before taxes', [168787, 204137, 160504, 53489], { bold: true, rule: true }),
  r('Direct taxes', [-50636, -61241, -48151, -16047], { indent: true }),
  r('Net profit for the period', [118151, 142896, 112353, 37442], { bold: true, rule: true }),
]

// ── Balance sheet ─────────────────────────────────────────────────────────────────────
export const BALANCE = [
  { heading: 'Assets' },
  r('Property, plant & equipment', [6000000, 5950000, 6000000, 6000000], { indent: true }),
  r('Trade receivables', [78170, 91733, 89473, 63432], { indent: true, gloss: 'Trade receivables' }),
  r('Cash and cash equivalents', [744162, 858550, 689919, 705733], { indent: true }),
  r('Total assets', [6822332, 6900283, 6779392, 6769165], { bold: true, rule: true }),
  { heading: "Shareholders' equity" },
  r('Share capital', [2000000, 2000000, 2000000, 2000000], { indent: true }),
  r('Retained earnings', [765500, 823387, 750000, 600000], { indent: true }),
  r('Net profit for the period', [118151, 142896, 112353, 37442], { indent: true }),
  r('Total equity', [2883651, 2966283, 2862353, 2637442], { bold: true, rule: true }),
  { heading: "Shareholders' liabilities" },
  r('Long-term loans', [3345725, 3345725, 3345725, 3500000], { indent: true }),
  r('Short-term loans', [0, 0, 0, 0], { indent: true }),
  r('Trade payables', [592956, 588275, 571314, 631723], { indent: true, gloss: 'Trade payables' }),
  r('Total equity + liabilities', [6822332, 6900283, 6779392, 6769165], { bold: true, rule: true }),
]

// ── Market report (THE ANCHOR) ────────────────────────────────────────────────────────
export const MARKET = {
  roomRates: [
    r('Booked this winter', [150, 130, 220, 150], { fmt: 'rate' }),
    r('Booked last summer', [150, 150, 150, 150], { fmt: 'rate' }),
    r('Booked two seasons ago (winter)', [90, 100, 100, 119], { fmt: 'rate' }),
    r('Average room rate', [110.36, 109.84, 110.75, 118.55], { fmt: 'rate', bold: true }),
  ],
  salesAndNights: [
    r('Revenue per available room', [8716, 19564, 19562, 7814]),
    r('Sales revenue this period', [485780, 529164, 537109, 380594], { bold: true }),
    r('Nights sold (total)', [4211, 4818, 4810, 3311], { fmt: 'nights', gloss: 'room-night' }),
    r('Occupancy', [46.79, 53.53, 53.44, 36.79], { fmt: 'pct', bold: true, gloss: 'Occupancy' }),
  ],
  totalMarket: [
    r('Total market demand', [17149, null, null, null], { fmt: 'nights', single: true }),
    r('Total market supply', [36000, null, null, null], { fmt: 'nights', single: true }),
  ],
}

// ── Operations report ─────────────────────────────────────────────────────────────────
export const OPERATIONS = [
  { heading: 'Capacity' },
  r('Rooms', [50, 50, 50, 50], { indent: true }),
  r('Nights available', [9000, 9000, 9000, 9000], { indent: true, fmt: 'nights', gloss: 'room-night' }),
  r('Condition of facilities', [88.4, 88.4, 88.4, 84.0], { indent: true, fmt: 'pct' }),
  { heading: 'Sales this period' },
  r('Nights sold', [4211, 4818, 4810, 3311], { indent: true, fmt: 'nights' }),
  r('Occupancy', [46.79, 53.53, 53.44, 36.79], { indent: true, fmt: 'pct', gloss: 'Occupancy' }),
  { heading: 'Personnel' },
  r('Permanent employees', [4.5, 4.0, 4.5, 4.0], { indent: true, fmt: 'num' }),
  r('Temporary employees', [4.0, 1.5, 4.0, 3.0], { indent: true, fmt: 'num' }),
  r('Average competence level', [0.87, 1.01, 1.04, 0.86], { indent: true, fmt: 'num' }),
  r('Quality level', [7.62, 7.57, 7.68, 6.10], { indent: true, fmt: 'num', gloss: 'Quality Level' }),
  r('Personnel stress level', [5.06, 3.86, 4.20, 5.90], { indent: true, fmt: 'num' }),
]

// ── Cash flow ─────────────────────────────────────────────────────────────────────────
export const CASHFLOW = [
  { heading: 'From operations' },
  r('EBITDA', [235460, 271511, 227177, 119385], { indent: true, gloss: 'EBITDA' }),
  r('Financing income and expenses', [-16673, -17374, -16673, -15896], { indent: true }),
  r('Direct taxes', [-50636, -61241, -48151, -16047], { indent: true }),
  r('Change in working capital', [-18000, -24933, -19000, -27000], { indent: true }),
  r('Net operating cash flow', [150151, 167963, 143353, 60442], { bold: true, rule: true }),
  r('Net investment cash flow', [0, 0, 0, 0]),
  { heading: 'From financing' },
  r('Change in long-term loans', [0, 0, 0, 0], { indent: true }),
  r('Dividends paid', [0, 0, 0, 0], { indent: true }),
  r('Net financing cash flow', [0, 0, 0, 0], { bold: true, rule: true }),
  r('Net change in cash', [150151, 167963, 143353, 60442], { bold: true }),
  r('Cash at end of period', [744162, 858550, 689919, 705733], { bold: true, rule: true }),
]

// ── Ratios (the scoreboard) ───────────────────────────────────────────────────────────
export const RATIOS = [
  r('Cumulative total shareholder return % pa', [41.74, 56.92, 30.54, -16.02], { fmt: 'pct', bold: true, gloss: 'TSR' }),
  r('Return on capital employed (ROCE) % annual', [9.74, 7.58, 9.04, 3.20], { fmt: 'pct', gloss: 'ROCE' }),
  r('Gross profit ratio %', [71.45, 79.51, 75.38, 71.10], { fmt: 'pct' }),
  r('Net profit ratio % (12 months)', [15.81, 18.48, 15.23, 9.80], { fmt: 'pct' }),
  r('Gearing %', [80.15, 78.46, 80.25, 88.40], { fmt: 'pct', gloss: 'Gearing' }),
  r('Asset turnover ratio', [0.18, 0.17, 0.17, 0.15], { fmt: 'num' }),
  r('Earnings per share (EPS)', [0.77, 1.03, 0.67, -0.20], { fmt: 'rate', gloss: 'EPS' }),
  r('Number of shares', [100000, 100000, 100000, 100000], { fmt: 'int' }),
  r('Hotel occupancy ratio %', [46.79, 53.53, 53.44, 36.79], { fmt: 'pct', gloss: 'Occupancy' }),
  r('Weighted average room rate', [110.36, 109.84, 110.75, 118.55], { fmt: 'rate' }),
  r('Gross profit per room', [7033, 8416, 7795, 4591], { fmt: 'usd' }),
  r('Net profit per room', [1648, 2591, 1549, -966], { fmt: 'usd' }),
]

// ── Sorting (league table) — read exactly from the high-res screenshot ────────────────
export const SORTING_COLUMNS = [
  { key: 'tsr', label: 'Cumulative TSR % pa', fmt: 'pct' },
  { key: 'ebitdaPrev', label: 'EBITDA, previous 6 months', fmt: 'usd' },
  { key: 'ebitdaRoll', label: 'EBITDA, rolling 12 months', fmt: 'usd' },
  { key: 'shareDom', label: 'Market share %, domestic', fmt: 'pct' },
  { key: 'occDom', label: 'Occupancy %, domestic', fmt: 'pct' },
]
export const SORTING_ROWS = [
  { team: 'northline', tsr: 41.74, ebitdaPrev: 235460, ebitdaRoll: 556308, shareDom: 24.56, occDom: 46.79 },
  { team: 'red', tsr: 56.92, ebitdaPrev: 271511, ebitdaRoll: 592359, shareDom: 28.09, occDom: 53.53 },
  { team: 'blue', tsr: 30.54, ebitdaPrev: 221786, ebitdaRoll: 542634, shareDom: 28.05, occDom: 53.44 },
  { team: 'america', tsr: -16.02, ebitdaPrev: 119385, ebitdaRoll: 440233, shareDom: 19.31, occDom: 36.79 },
]

// The single most useful anchor numbers, surfaced in the Sales hint + past-results modal.
export const ANCHOR = {
  bookedRate: 130, // Hotel Red, Round 1 walk-in rate booked
  avgRate: 109.84, // weighted average room rate
  occupancy: 53.53, // %
  nightsSold: 4818,
  capacity: 9000,
  marketing: 7000, // marketing spend last round (≈ the carried-forward default)
}
