// build-round-results.mjs
// Generates src/data/roundResults.js from the real Cesim exports on the Desktop
// (results-r01/02/03.xls). The spreadsheets are the backbone — re-run this when a new
// round export arrives (drop results-r04.xls next to the others, add 4 to ROUNDS below).
//
//   node scripts/build-round-results.mjs
//
// Requires SheetJS (installed in /tmp during the build; falls back to a local copy).
import { createRequire } from 'module'
import { writeFileSync } from 'fs'
const require = createRequire(import.meta.url)
let xlsx
try { xlsx = require('xlsx') } catch { xlsx = require('/tmp/node_modules/xlsx/xlsx.js') }

const SRC_DIR = new URL('../public/data/results', import.meta.url).pathname
const OUT = new URL('../src/data/roundResults.js', import.meta.url).pathname
const ROUNDS = [1, 2, 3, 4, 5, 6, 7]
const SEASON_OF = (n) => (n % 2 === 1 ? 'Winter' : 'Summer') // odd=Winter, even=Summer

// Team columns in the sheet, in order: [Northline, Hotel Red, Blue, America] = cols 1..4
const TEAM_COLS = [1, 2, 3, 4]

function load(n) {
  const wb = xlsx.readFile(`${SRC_DIR}/results-r${String(n).padStart(2, '0')}.xls`)
  return xlsx.utils.sheet_to_json(wb.Sheets['Results'], { header: 1, blankrows: false, defval: '' })
}

const round2 = (v) => Math.round(v * 100) / 100
const roundN = (v) => Math.round(v)

// Pull a row's four team values, rounded per fmt; `neg` flips sign (for display of
// depreciation / interest expense / taxes as negatives).
function vals(rows, i, fmt, neg = false) {
  const raw = TEAM_COLS.map((c) => {
    const v = rows[i]?.[c]
    return typeof v === 'number' ? v : 0
  })
  return raw.map((v) => {
    const s = neg ? -v : v
    if (fmt === 'rate' || fmt === 'num' || fmt === 'pct') return round2(s)
    return roundN(s) // usd, nights, int, default
  })
}

const r = (rows, i, label, fmt, opts = {}) => ({ label, vals: vals(rows, i, fmt, opts.neg), ...(fmt ? { fmt } : {}), ...stripNeg(opts) })
const h = (heading) => ({ heading })
function stripNeg(o) { const { neg, ...rest } = o; void neg; return rest }

// ── Section builders (row indices are identical across all three exports) ─────────────
function income(rows) {
  return [
    h('Sales revenue'),
    r(rows, 154, 'Domestic', 'usd', { indent: true }),
    r(rows, 155, 'International', 'usd', { indent: true, ghostRow: true }),
    r(rows, 156, 'Total sales', 'usd', { bold: true, rule: true }),
    h('Personnel expenses and direct costs'),
    r(rows, 159, 'Permanent', 'usd', { indent: true }),
    r(rows, 160, 'Temporary', 'usd', { indent: true }),
    r(rows, 161, 'Direct cost', 'usd', { indent: true }),
    r(rows, 163, 'Gross profit', 'usd', { bold: true, rule: true }),
    h('Other operating expenses'),
    r(rows, 166, 'Administration', 'usd', { indent: true }),
    r(rows, 167, 'Marketing', 'usd', { indent: true }),
    r(rows, 168, 'Rental payment', 'usd', { indent: true }),
    r(rows, 169, 'Layoff and recruitment', 'usd', { indent: true }),
    r(rows, 170, 'Personnel training', 'usd', { indent: true }),
    r(rows, 171, 'Cost saving efforts', 'usd', { indent: true }),
    r(rows, 172, 'Maintenance', 'usd', { indent: true }),
    r(rows, 175, 'EBITDA', 'usd', { bold: true, rule: true, gloss: 'EBITDA' }),
    r(rows, 176, 'Depreciation', 'usd', { indent: true, neg: true, gloss: 'Depreciation' }),
    r(rows, 177, 'EBIT', 'usd', { bold: true, gloss: 'EBIT' }),
    h('Financing income and expenses'),
    r(rows, 180, 'Interest income', 'usd', { indent: true }),
    r(rows, 181, 'Interest expense (long-term)', 'usd', { indent: true, neg: true }),
    r(rows, 182, 'Interest expense (short-term)', 'usd', { indent: true, neg: true }),
    r(rows, 183, 'Income before taxes', 'usd', { bold: true, rule: true }),
    r(rows, 184, 'Direct taxes', 'usd', { indent: true, neg: true }),
    r(rows, 185, 'Net profit for the period', 'usd', { bold: true, rule: true }),
  ]
}

function balance(rows) {
  return [
    h('Assets'),
    r(rows, 220, 'Property, plant & equipment', 'usd', { indent: true }),
    r(rows, 222, 'Trade receivables', 'usd', { indent: true, gloss: 'Trade receivables' }),
    r(rows, 223, 'Cash and cash equivalents', 'usd', { indent: true }),
    r(rows, 224, 'Total assets', 'usd', { bold: true, rule: true }),
    h("Shareholders' equity"),
    r(rows, 227, 'Share capital', 'usd', { indent: true }),
    r(rows, 228, 'Retained earnings', 'usd', { indent: true }),
    r(rows, 229, 'Net profit for the period', 'usd', { indent: true }),
    r(rows, 230, 'Total equity', 'usd', { bold: true, rule: true }),
    h('Liabilities'),
    r(rows, 232, 'Long-term loans', 'usd', { indent: true }),
    r(rows, 234, 'Short-term loans', 'usd', { indent: true }),
    r(rows, 235, 'Trade payables', 'usd', { indent: true, gloss: 'Trade payables' }),
    r(rows, 236, 'Total liabilities', 'usd', { bold: true, rule: true }),
    r(rows, 237, 'Total equity + liabilities', 'usd', { bold: true }),
  ]
}

function market(rows) {
  const seasonLabel = String(rows[31]?.[1] || '').trim() || 'This season'
  return {
    roomRates: [
      r(rows, 3, 'Walk-in room rate', 'rate', { bold: true }),
      r(rows, 6, 'Weighted average room rate', 'rate'),
    ],
    salesAndNights: [
      r(rows, 8, 'Walk-in nights sold', 'nights', { bold: true, gloss: 'room-night' }),
      r(rows, 12, 'Revenue per available room', 'usd'),
      r(rows, 13, 'Sales revenue this period', 'usd', { bold: true }),
      r(rows, 11, 'Nights sold (total)', 'nights'),
      r(rows, 273, 'Occupancy', 'pct', { bold: true, gloss: 'Occupancy' }),
    ],
    advance: [
      r(rows, 26, 'Advance price — next round', 'rate'),
      r(rows, 27, 'Advance nights — next round', 'nights'),
      r(rows, 29, 'Advance price — two rounds ahead', 'rate'),
      r(rows, 30, 'Advance nights — two rounds ahead', 'nights'),
    ],
    totalMarket: [
      { ...r(rows, 32, `Total market demand (${seasonLabel.toLowerCase()})`, 'nights'), single: true },
      { ...r(rows, 33, 'Total market supply', 'nights'), single: true },
    ],
  }
}

function operations(rows) {
  return [
    h('Capacity'),
    r(rows, 37, 'Rooms', 'int', { indent: true }),
    r(rows, 38, 'Nights available', 'nights', { indent: true, gloss: 'room-night' }),
    h('Sales this period'),
    r(rows, 41, 'Nights sold', 'nights', { indent: true }),
    r(rows, 42, 'Occupancy', 'pct', { indent: true, gloss: 'Occupancy' }),
    h('Personnel (decisions + outcomes)'),
    r(rows, 57, 'Permanent employees', 'num', { indent: true }),
    r(rows, 60, 'Temporary employees', 'num', { indent: true }),
    r(rows, 52, 'Wage / month', 'usd', { indent: true }),
    r(rows, 53, 'Training / person', 'usd', { indent: true }),
    r(rows, 55, 'Personnel turnover', 'pct', { indent: true }),
    r(rows, 64, 'Average competence (permanent)', 'num', { indent: true }),
    r(rows, 74, 'Personnel stress level', 'pct', { indent: true }),
    r(rows, 75, 'Quality level', 'num', { indent: true, gloss: 'Quality Level' }),
  ]
}

function cashflow(rows) {
  return [
    h('From operations'),
    r(rows, 241, 'EBITDA', 'usd', { indent: true, gloss: 'EBITDA' }),
    r(rows, 242, 'Financing income and expenses', 'usd', { indent: true }),
    r(rows, 243, 'Direct taxes', 'usd', { indent: true }),
    r(rows, 244, 'Change in working capital', 'usd', { indent: true }),
    r(rows, 247, 'Net operating cash flow', 'usd', { bold: true, rule: true }),
    r(rows, 249, 'Net investment cash flow', 'usd'),
    h('From financing'),
    r(rows, 250, 'Change in long-term loans', 'usd', { indent: true }),
    r(rows, 252, 'Dividends paid', 'usd', { indent: true }),
    r(rows, 253, 'Net financing cash flow', 'usd', { bold: true, rule: true }),
    r(rows, 254, 'Net change in cash', 'usd', { bold: true }),
    r(rows, 256, 'Cash at end of period', 'usd', { bold: true, rule: true }),
  ]
}

function ratios(rows) {
  return [
    r(rows, 259, 'Cumulative total shareholder return % pa', 'pct', { bold: true, gloss: 'TSR' }),
    r(rows, 266, 'Return on capital employed (ROCE) % annual', 'pct', { gloss: 'ROCE' }),
    r(rows, 267, 'Gross profit ratio %', 'pct'),
    r(rows, 268, 'Net profit ratio %', 'pct'),
    r(rows, 269, 'Gearing %', 'pct', { gloss: 'Gearing' }),
    r(rows, 270, 'Asset turnover ratio', 'num'),
    r(rows, 271, 'Company-specific prime rate % (annual)', 'pct'),
    r(rows, 264, 'Earnings per share (EPS)', 'rate', { gloss: 'EPS' }),
    r(rows, 262, 'Market value of share', 'rate'),
    r(rows, 265, 'Number of shares', 'int'),
    r(rows, 273, 'Hotel occupancy ratio %', 'pct', { gloss: 'Occupancy' }),
    r(rows, 275, 'Weighted average room rate', 'rate'),
    r(rows, 277, 'Gross profit per room', 'usd'),
    r(rows, 278, 'Net profit per room', 'usd'),
  ]
}

function sorting(rows) {
  const demand = rows[32]?.[1] || 0 // total market nights (domestic)
  const teams = ['northline', 'red', 'blue', 'america']
  return teams.map((team, k) => {
    const c = TEAM_COLS[k]
    const nights = rows[11]?.[c] || 0
    return {
      team,
      tsr: round2(rows[259]?.[c] || 0),
      ebitdaPrev: roundN(rows[175]?.[c] || 0),
      ebitdaRoll: roundN(rows[206]?.[c] || 0),
      shareDom: demand ? round2((nights / demand) * 100) : 0,
      occDom: round2(rows[273]?.[c] || 0),
    }
  })
}

// Hotel Red anchor (col 2) for the past-results modal.
function anchor(rows) {
  const C = 2
  return {
    walkInRate: round2(rows[3]?.[C] || 0),
    walkInNights: roundN(rows[8]?.[C] || 0),
    avgRate: round2(rows[6]?.[C] || 0),
    occupancy: round2(rows[273]?.[C] || 0),
    nightsSold: roundN(rows[11]?.[C] || 0),
    capacity: roundN(rows[38]?.[C] || 9000),
    marketing: roundN(rows[18]?.[C] || 0),
    netProfit: roundN(rows[185]?.[C] || 0),
    ebitda: roundN(rows[175]?.[C] || 0),
  }
}

// Hotel Red's actual decisions that round (col 2) — for the review-only decision pages.
function decisions(rows) {
  const C = 2
  return {
    walkInRate: round2(rows[3]?.[C] || 0),
    estNightsSold: roundN(rows[8]?.[C] || 0), // realized walk-in nights (what they sold)
    marketing: roundN(rows[18]?.[C] || 0),
    advanceNextSeason: roundN(rows[27]?.[C] || 0),
    advanceTwoSeasons: roundN(rows[30]?.[C] || 0),
    maintenance: roundN(rows[16]?.[C] || 0),
    headcount: round2(rows[57]?.[C] || 0),
    wage: roundN(rows[52]?.[C] || 0),
    training: roundN(rows[53]?.[C] || 0),
    turnover: round2(rows[55]?.[C] || 0),
  }
}

// ── Build everything ──────────────────────────────────────────────────────────────────
const META = {}
const DATA = {}
const SUMMARY = { ebitda: {}, netProfit: {}, tsr: {}, eps: {} }
const ANCHORS = {}
const DECISIONS = {}

for (const n of ROUNDS) {
  const rows = load(n)
  META[n] = { n, season: SEASON_OF(n), label: `Round ${n} · ${SEASON_OF(n)}`, state: 'past' }
  DATA[n] = {
    income: income(rows),
    balance: balance(rows),
    market: market(rows),
    operations: operations(rows),
    cashflow: cashflow(rows),
    ratios: ratios(rows),
    sorting: sorting(rows),
  }
  SUMMARY.ebitda[n] = TEAM_COLS.map((c) => roundN(rows[175]?.[c] || 0))
  SUMMARY.netProfit[n] = TEAM_COLS.map((c) => roundN(rows[185]?.[c] || 0))
  SUMMARY.tsr[n] = TEAM_COLS.map((c) => round2(rows[259]?.[c] || 0))
  SUMMARY.eps[n] = TEAM_COLS.map((c) => round2(rows[264]?.[c] || 0))
  ANCHORS[n] = anchor(rows)
  DECISIONS[n] = decisions(rows)
}

const J = (o) => JSON.stringify(o, null, 2)
const header = `// roundResults.js — GENERATED by scripts/build-round-results.mjs from the real Cesim
// exports (results-r01/02/03.xls). DO NOT EDIT BY HAND — re-run the generator instead.
// Every value here is the real transcribed figure. Teams order: [Northline, Hotel Red,
// Blue, America]; only Hotel Red is active (the rest render ghosted + anonymized).
//
// Seasons alternate odd=Winter, even=Summer. Rounds 1-3 complete; Round 4 (Summer) is the
// live/current round (see config.js CURRENT_ROUND) and has no export yet.

`

const body = [
  `export const ROUND_META = ${J(META)}`,
  `export const RESULT_TEAMS = ${J([
    { key: 'northline', name: 'The Northline', active: false },
    { key: 'red', name: 'Hotel Red', active: true },
    { key: 'blue', name: 'Blue', active: false },
    { key: 'america', name: 'Hotel America', active: false },
  ])}`,
  `export const ROUNDS_DATA = ${J(DATA)}`,
  `export const SUMMARY = ${J(SUMMARY)}`,
  `// Hotel Red's headline numbers per round (past-results anchor).`,
  `export const ANCHORS = ${J(ANCHORS)}`,
  `// Hotel Red's actual decisions per round (seed the review-only decision pages).`,
  `export const PAST_DECISIONS = ${J(DECISIONS)}`,
  `export const COMPLETED_ROUNDS = ${J(ROUNDS)}`,
].join('\n\n')

writeFileSync(OUT, header + body + '\n')
console.log('Wrote', OUT)
console.log('Rounds:', ROUNDS.join(', '))
for (const n of ROUNDS) console.log(`  R${n} ${META[n].season}: Hotel Red EBITDA ${SUMMARY.ebitda[n][1]}, net ${SUMMARY.netProfit[n][1]}, walk-in $${ANCHORS[n].walkInRate}->${ANCHORS[n].walkInNights}`)
