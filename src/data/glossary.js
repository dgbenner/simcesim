// GLOSSARY — acronym + term definitions for the explain layer (spec §11).
//
// Two consumers:
//   1. AcronymTooltip — underlines any term whose key appears in UI text and shows the
//      definition on hover/focus. Finance + the Projections modal are densest with these.
//   2. Field info-icons / dock — pull longer definitions where a field references a term.
//
// Keys are matched case-insensitively. `aka` lists alternate spellings that should also
// underline (e.g. "Δ%" and "Delta %").

export const GLOSSARY = {
  EBITDA: {
    term: 'EBITDA',
    aka: [],
    short: 'Earnings Before Interest, Taxes, Depreciation & Amortization.',
    long: 'Operating revenue minus operating expenses. Roughly, profit from running the hotel before financing costs and accounting deductions.',
  },
  EBIT: {
    term: 'EBIT',
    aka: [],
    short: 'Operating profit — EBITDA minus depreciation.',
    long: 'EBITDA minus depreciation. What the hotel earns from operations before interest and tax.',
  },
  ROCE: {
    term: 'ROCE',
    aka: ['Return on Capital Employed'],
    short: 'Return on Capital Employed.',
    long: 'How much operating profit you generate per dollar of capital (equity + interest-bearing debt) tied up in the business.',
  },
  Gearing: {
    term: 'Gearing',
    aka: [],
    short: 'How much of the capital structure is debt vs. equity.',
    long: 'The debt-to-equity balance of how you finance the business. Higher gearing means more financial risk — and, over time, a higher borrowing rate.',
  },
  EPS: {
    term: 'EPS',
    aka: ['Earnings Per Share'],
    short: 'Earnings Per Share — profit ÷ 100,000 shares.',
    long: 'Profit for the round divided by the 100,000 shares outstanding. Per-share earnings.',
  },
  'P/E': {
    term: 'P/E',
    aka: ['PE ratio', 'price/earnings'],
    short: 'Share price ÷ EPS.',
    long: 'Price-to-earnings: what the market pays per dollar of earnings. A market valuation signal.',
  },
  'Δ%': {
    term: 'Δ%',
    aka: ['Delta %', 'Δ %', 'Change %'],
    short: 'The change versus the comparison column.',
    long: 'Delta percent — the change versus the comparison column (e.g. vs. last season or last year). Not the same as a share or margin; it is a period-over-period change.',
  },
  Occupancy: {
    term: 'Occupancy %',
    aka: ['Occupancy', 'Hotel occupancy'],
    short: 'Nights sold ÷ nights available (capacity).',
    long: 'The share of your capacity that was filled. A room-night left unsold is gone forever (perishable inventory) — which is why filling rooms matters so much.',
  },
  'room-night': {
    term: 'Room-night',
    aka: ['room-nights', 'nights', 'night'],
    short: 'One room for one night.',
    long: 'One room occupied for one night. Capacity = rooms × 180 × seasons. Most "nights" figures are room-nights, not rooms.',
  },
  'walk-in': {
    term: 'Walk-in vs. advance sales',
    aka: ['walk-in', 'advance sales'],
    short: 'Walk-in = individuals at your rate; advance = bulk pre-sold to agencies.',
    long: 'Walk-in: individuals booking during the season at your set rate. Advance: bulk room-nights pre-sold to travel agencies for future seasons at a volume-discounted price.',
  },
  'estimation cell': {
    term: 'Estimation cell',
    aka: ['estimation'],
    short: 'Feeds the budget/projection only — does not change actual results.',
    long: 'A field whose value feeds the budget/projection only and does NOT change actual results (e.g. estimated nights sold, personnel turnover estimate). Part of the honesty boundary: actual demand resolves in the live system.',
  },
  'Quality Level': {
    term: 'Quality Level',
    aka: ['quality level'],
    short: 'Facility condition + personnel quality, as customers experience it.',
    long: 'Facility condition + personnel quality, as customers experience it. Personnel quality depends on the temp/permanent ratio and average competence; competence depends on the new/old staff ratio, training (this round + prior), and new-hire wages. Quality Level supports demand and the price you can command.',
  },
  TSR: {
    term: 'TSR',
    aka: ['Cumulative Total Shareholder Return', 'Total Shareholder Return'],
    short: 'Cumulative Total Shareholder Return — the scoreboard metric.',
    long: 'Cumulative Total Shareholder Return: share-price change + dividends + reinvested returns, annualized. The ultimate scoreboard — how the game is won.',
  },
  Depreciation: {
    term: 'Depreciation',
    aka: [],
    short: 'The accounting write-down of the property each period (non-cash).',
    long: 'The periodic write-down of property value. It reduces EBIT but is not a cash outflow, so it is added back in the cash flow.',
  },
  'Trade receivables': {
    term: 'Trade receivables',
    aka: ['trade receivables', 'receivables'],
    short: 'Money owed to you by agencies you extended credit to.',
    long: 'Sales you have made but not yet collected — cash tied up because you let agencies pay later (driven by your credit term).',
  },
  'Trade payables': {
    term: 'Trade payables',
    aka: ['trade payables', 'payables'],
    short: 'Money you owe suppliers (≈16.67% of sales, ~30-day terms).',
    long: 'Amounts you owe suppliers, modeled at ~16.67% of sales (roughly 30-day terms). A short-term, interest-free source of financing.',
  },
}

// Flatten to a lookup keyed by every term + alias (lowercased) for the underliner.
export const GLOSSARY_LOOKUP = Object.values(GLOSSARY).reduce((acc, entry) => {
  acc[entry.term.toLowerCase()] = entry
  for (const alt of entry.aka || []) acc[alt.toLowerCase()] = entry
  return acc
}, {})

export const lookupTerm = (raw) =>
  GLOSSARY_LOOKUP[String(raw).trim().toLowerCase()] || null
