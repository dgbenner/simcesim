// lastRoundResults.js
// REAL ROUND 1 (WINTER) RESULTS — transcribed from the `results-r01.xls` export for all
// four teams (spec addendum §2). Domestic, USD. This is the completed ANCHOR round the
// Results page + past-results hint display; Round 2 · Summer is the current decision round.
//
// The spec gives the headline figures exactly (walk-in price/nights, sales, occupancy,
// RevPAR, the levers each team chose, and the bottom-of-statement subtotals: EBITDA → net
// profit). Intermediate income-statement rows (personnel, direct cost, administration) are
// reconciled so each column SUMS to the real EBITDA/EBIT/net profit — administration is the
// plug. When more round exports arrive, drop them in alongside this one.
//
// Columns are the four teams in this order: [northline, red, blue, america]. Only Hotel Red
// is active; the rest render ghosted (global competitor-ghosting + anonymization rules).

export const LAST_ROUND = { n: 1, season: 'Winter', label: 'Round 1 · Winter' }

export const RESULT_TEAMS = [
  { key: 'northline', name: 'The Northline', active: false },
  { key: 'red', name: 'Hotel Red', active: true },
  { key: 'blue', name: 'Blue', active: false },
  { key: 'america', name: 'Hotel of America', active: false },
]

// Order matches RESULT_TEAMS: [northline, red, blue, america]
const r = (label, vals, opts = {}) => ({ label, vals, ...opts })

// ── Income statement (Round 1 · Winter, 6 months) ─────────────────────────────────────
// Bottom-line subtotals are the real reported figures; intermediate rows reconcile to them.
export const INCOME = [
  { heading: 'Sales revenue' },
  r('Domestic', [485790, 529144, 547109, 390704], { indent: true }),
  r('International', [0, 0, 0, 0], { indent: true, ghostRow: true }),
  r('Total sales', [485790, 529144, 547109, 390704], { bold: true, rule: true }),
  { heading: 'Personnel expenses and direct costs' },
  r('Permanent', [45000, 72000, 105000, 74400], { indent: true }),
  r('Temporary', [30000, 0, 15000, 15000], { indent: true }),
  r('Direct cost', [31877, 36472, 36412, 25064], { indent: true }),
  r('Gross profit', [378913, 420672, 390697, 276240], { bold: true, rule: true }),
  { heading: 'Other operating expenses' },
  r('Marketing', [7500, 7000, 15500, 11000], { indent: true }),
  r('Administration', [54953, 44911, 52411, 49155], { indent: true }),
  r('Rental payment', [62500, 62500, 62500, 62500], { indent: true }),
  r('Layoff and recruitment', [2000, 4000, 1000, 2000], { indent: true }),
  r('Personnel training', [1500, 4000, 7500, 4200], { indent: true }),
  r('Cost saving efforts', [7000, 8000, 10000, 8000], { indent: true }),
  r('Maintenance', [8000, 18750, 20000, 20000], { indent: true }),
  r('EBITDA', [235460, 271511, 221786, 119385], { bold: true, rule: true, gloss: 'EBITDA' }),
  r('Depreciation', [-50000, -50000, -50000, -50000], { indent: true, gloss: 'Depreciation' }),
  r('EBIT', [185460, 221511, 171786, 69385], { bold: true, gloss: 'EBIT' }),
  { heading: 'Financing income and expenses' },
  r('Interest income', [12024, 12300, 11964, 11194], { indent: true }),
  r('Interest expenses', [-87075, -86587, -87363, -89011], { indent: true }),
  r('Income before taxes', [110409, 147224, 96387, -8432], { bold: true, rule: true }),
  r('Direct taxes', [-33123, -44167, -28916, 0], { indent: true }),
  r('Net profit for the period', [77286, 103057, 67471, -8432], { bold: true, rule: true }),
]

// ── Balance sheet (close of Round 1) ──────────────────────────────────────────────────
// Net profit flows in from the income statement; competitor balances are representative.
// Cash is the plug so each column balances (assets = equity + liabilities).
export const BALANCE = [
  { heading: 'Assets' },
  r('Property, plant & equipment', [5950000, 5950000, 5950000, 5950000], { indent: true }),
  r('Trade receivables', [80981, 88208, 91203, 65130], { indent: true, gloss: 'Trade receivables' }),
  r('Cash and cash equivalents', [731786, 814911, 718497, 591338], { indent: true }),
  r('Total assets', [6762767, 6853119, 6759700, 6606468], { bold: true, rule: true }),
  { heading: "Shareholders' equity" },
  r('Share capital', [2000000, 2000000, 2000000, 2000000], { indent: true }),
  r('Retained earnings', [765500, 823387, 750000, 600000], { indent: true }),
  r('Net profit for the period', [77286, 103057, 67471, -8432], { indent: true }),
  r('Total equity', [2842786, 2926444, 2817471, 2591568], { bold: true, rule: true }),
  { heading: "Shareholders' liabilities" },
  r('Long-term loans', [3345725, 3345725, 3345725, 3500000], { indent: true }),
  r('Short-term loans', [0, 0, 0, 0], { indent: true }),
  r('Trade payables', [574256, 580950, 596504, 514900], { indent: true, gloss: 'Trade payables' }),
  r('Total equity + liabilities', [6762767, 6853119, 6759700, 6606468], { bold: true, rule: true }),
]

// ── Market report (THE ANCHOR — the price→volume signal the demand model is fit to) ────
export const MARKET = {
  roomRates: [
    r('Walk-in room rate', [150, 125, 135, 250], { fmt: 'rate', bold: true }),
    r('Weighted average room rate', [115.36, 109.84, 113.76, 118.00], { fmt: 'rate' }),
  ],
  salesAndNights: [
    r('Walk-in nights sold', [1299, 1905, 1897, 399], { fmt: 'nights', bold: true, gloss: 'room-night' }),
    r('Revenue per available room', [9716, 10583, 10942, 7814]),
    r('Sales revenue this period', [485790, 529144, 547109, 390704], { bold: true }),
    r('Nights sold (total)', [4211, 4818, 4810, 3311], { fmt: 'nights' }),
    r('Occupancy', [46.79, 53.53, 53.44, 36.79], { fmt: 'pct', bold: true, gloss: 'Occupancy' }),
  ],
  totalMarket: [
    r('Total market demand', [17149, null, null, null], { fmt: 'nights', single: true }),
    r('Total market supply', [36000, null, null, null], { fmt: 'nights', single: true }),
  ],
}

// ── Operations report (capacity, real personnel levers, outcomes) ─────────────────────
export const OPERATIONS = [
  { heading: 'Capacity' },
  r('Rooms', [50, 50, 50, 50], { indent: true }),
  r('Nights available', [9000, 9000, 9000, 9000], { indent: true, fmt: 'nights', gloss: 'room-night' }),
  r('Condition of facilities', [82.0, 88.4, 89.0, 89.0], { indent: true, fmt: 'pct' }),
  { heading: 'Sales this period' },
  r('Nights sold', [4211, 4818, 4810, 3311], { indent: true, fmt: 'nights' }),
  r('Occupancy', [46.79, 53.53, 53.44, 36.79], { indent: true, fmt: 'pct', gloss: 'Occupancy' }),
  { heading: 'Personnel' },
  r('Permanent employees', [3.0, 4.0, 5.0, 4.0], { indent: true, fmt: 'num' }),
  r('Temporary employees', [2.0, 0.0, 1.0, 1.0], { indent: true, fmt: 'num' }),
  r('Average competence level', [0.90, 0.99, 1.07, 1.04], { indent: true, fmt: 'num' }),
  r('Quality level', [7.40, 7.90, 8.20, 8.00], { indent: true, fmt: 'num', gloss: 'Quality Level' }),
  r('Personnel stress level %', [3.0, 16.0, 1.0, 1.0], { indent: true, fmt: 'pct' }),
]

// ── Cash flow (Round 1) ───────────────────────────────────────────────────────────────
export const CASHFLOW = [
  { heading: 'From operations' },
  r('EBITDA', [235460, 271511, 221786, 119385], { indent: true, gloss: 'EBITDA' }),
  r('Financing income and expenses', [-75051, -74287, -75399, -77817], { indent: true }),
  r('Direct taxes', [-33123, -44167, -28916, 0], { indent: true }),
  r('Change in working capital', [-6725, -7258, -5301, 49770], { indent: true }),
  r('Net operating cash flow', [120561, 145799, 112170, 91338], { bold: true, rule: true }),
  r('Net investment cash flow', [0, 0, 0, 0]),
  { heading: 'From financing' },
  r('Change in long-term loans', [0, 0, 0, 0], { indent: true }),
  r('Dividends paid', [0, 0, 0, 0], { indent: true }),
  r('Net financing cash flow', [0, 0, 0, 0], { bold: true, rule: true }),
  r('Net change in cash', [120561, 145799, 112170, 91338], { bold: true }),
  r('Cash at end of period', [731786, 814911, 718497, 591338], { bold: true, rule: true }),
]

// ── Ratios (the scoreboard) ───────────────────────────────────────────────────────────
export const RATIOS = [
  r('Cumulative total shareholder return % pa', [29.20, 38.94, 25.49, -3.19], { fmt: 'pct', bold: true, gloss: 'TSR' }),
  r('Return on capital employed (ROCE) % annual', [5.95, 7.07, 5.51, 2.24], { fmt: 'pct', gloss: 'ROCE' }),
  r('Gross profit ratio %', [78.00, 79.50, 71.41, 70.70], { fmt: 'pct' }),
  r('Net profit ratio %', [15.91, 19.48, 12.33, -2.16], { fmt: 'pct' }),
  r('Gearing %', [82.30, 80.05, 82.40, 90.10], { fmt: 'pct', gloss: 'Gearing' }),
  r('Asset turnover ratio', [0.15, 0.16, 0.16, 0.12], { fmt: 'num' }),
  r('Earnings per share (EPS)', [0.77, 1.03, 0.67, -0.08], { fmt: 'rate', gloss: 'EPS' }),
  r('Number of shares', [100000, 100000, 100000, 100000], { fmt: 'int' }),
  r('Hotel occupancy ratio %', [46.79, 53.53, 53.44, 36.79], { fmt: 'pct', gloss: 'Occupancy' }),
  r('Weighted average room rate', [115.36, 109.84, 113.76, 118.00], { fmt: 'rate' }),
  r('Gross profit per room', [7578, 8413, 7814, 5525], { fmt: 'usd' }),
  r('Net profit per room', [1546, 2061, 1349, -169], { fmt: 'usd' }),
]

// ── Sorting (league table) ────────────────────────────────────────────────────────────
export const SORTING_COLUMNS = [
  { key: 'tsr', label: 'Cumulative TSR % pa', fmt: 'pct' },
  { key: 'ebitdaPrev', label: 'EBITDA, previous 6 months', fmt: 'usd' },
  { key: 'ebitdaRoll', label: 'EBITDA, rolling 12 months', fmt: 'usd' },
  { key: 'shareDom', label: 'Market share %, domestic', fmt: 'pct' },
  { key: 'occDom', label: 'Occupancy %, domestic', fmt: 'pct' },
]
export const SORTING_ROWS = [
  { team: 'northline', tsr: 29.20, ebitdaPrev: 235460, ebitdaRoll: 555460, shareDom: 24.56, occDom: 46.79 },
  { team: 'red', tsr: 38.94, ebitdaPrev: 271511, ebitdaRoll: 591511, shareDom: 28.09, occDom: 53.53 },
  { team: 'blue', tsr: 25.49, ebitdaPrev: 221786, ebitdaRoll: 541786, shareDom: 28.05, occDom: 53.44 },
  { team: 'america', tsr: -3.19, ebitdaPrev: 119385, ebitdaRoll: 439385, shareDom: 19.31, occDom: 36.79 },
]

// The single most useful anchor numbers, surfaced in the Sales hint + past-results modal.
// Hotel Red, Round 1 · Winter.
export const ANCHOR = {
  bookedRate: 125, // Hotel Red walk-in rate
  walkInNights: 1905, // walk-in nights actually sold at $125
  avgRate: 109.84, // weighted average room rate (blends in discounted advance sales)
  occupancy: 53.53, // %
  nightsSold: 4818, // total nights sold
  capacity: 9000,
  marketing: 7000, // marketing spend (≈ the carried-forward default)
}
