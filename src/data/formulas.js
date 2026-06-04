// DETERMINISTIC MATH (spec §10). All figures USD.
//
// SIMCesim computes only the formula-defined accounting. For demand it uses Approach A:
// the user's `estNightsSold` estimate drives the budgeted income statement — it does NOT
// reproduce Cesim's hidden, competitor-dependent demand model. Where a relationship is
// genuinely hidden (advance pricing, cost-saving curves), this file uses a TRANSPARENT,
// DOCUMENTED stand-in marked `SIMPLIFIED` — never a fabricated demand model.
//
// Opening balances are representative (not pulled live) and chosen so the OPENING balance
// sheet balances; the accounting identity then holds for every set of decisions.

// ── Parameters (CONFIRMED from Market Outlook; season-dependent where noted) ──────────
const SEASON_PARAMS = {
  summer: {
    label: 'summer',
    primeAnnual: 0.0506, // company-specific prime (debt), annual
    cashAnnual: 0.0506, // cash interest, annual
    baseDirectCost: 7.7, // per room-night
    advanceBaseRate: 100, // SIMPLIFIED advance price anchor (volume-discounted below)
  },
  winter: {
    label: 'winter',
    primeAnnual: 0.0404,
    cashAnnual: 0.0404,
    baseDirectCost: 7.57,
    advanceBaseRate: 85,
  },
}

export { SEASON_PARAMS }

export const PARAMS = {
  roomCount: 50,
  nightsPerSeason: 180,
  capacityNights: 9000, // 50 × 180
  depreciation: 50000, // 1,000/room/6mo × 50
  rental: 62500, // property rental / 6 months (domestic)
  baseAdmin: 50000, // base administration cost (domestic)
  taxRate: 0.3,
  shortTermPremiumAnnual: 0.0201,
  payablesRate: 0.1667, // trade payables = 16.67% of sales
  shares: 100000,
  recruitCost: 4000, // per person (domestic)
  layoffCost: 12000, // per person (domestic, 0–5% band)
  priorHeadcount: 4, // last round's permanent headcount (for hire/layoff deltas)
  // SIMPLIFIED tuning constants — documented stand-ins, not live values:
  advanceVolumeDiscount: 0.4, // advance price falls up to 40% as volume → capacity
  directSavingScale: 100000, // $ of direct-saving effort per unit of fractional reduction
  adminSavingScale: 84000, // tuned so default $3,000 ≈ the live $48,210 admin line
  // Representative opening balance sheet (chosen so it balances; see note above):
  opening: {
    ppeNet: 6000000,
    receivables: 0,
    payables: 0,
    longTermLoan: 3345725, // = the loan floor (can't repay more than you owe)
    shareCapital: 2000000,
    retainedEarnings: 823387, // = the dividend cap (pay only from retained earnings)
  },
}

// Cash plug so the OPENING balance sheet balances.
PARAMS.opening.cash =
  PARAMS.opening.shareCapital +
  PARAMS.opening.retainedEarnings +
  PARAMS.opening.longTermLoan +
  PARAMS.opening.payables -
  (PARAMS.opening.ppeNet + PARAMS.opening.receivables)

// ── Helpers ───────────────────────────────────────────────────────────────────────────
const num = (v) => {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return Number.isFinite(n) ? n : 0
}
const perSeason = (annual) => annual / 2 // 6-month season

// SIMPLIFIED: advance price per night falls as offered volume approaches capacity.
function advancePrice(nights, base) {
  const frac = Math.min(1, num(nights) / PARAMS.capacityNights)
  return base * (1 - PARAMS.advanceVolumeDiscount * frac)
}

// Per-window advance price for display (volume-discounted). SIMPLIFIED stand-in.
export function advanceUnitPrice(nights, season = 'summer') {
  return advancePrice(nights, SEASON_PARAMS[season].advanceBaseRate)
}

// ── Income statement ────────────────────────────────────────────────────────────────
export function computeIncomeStatement(d, season = 'summer') {
  const sp = SEASON_PARAMS[season]

  const walkInRate = num(d.walkInRate)
  const estNights = num(d.estNightsSold)
  const advNext = num(d.advanceNextSeason)
  const advTwo = num(d.advanceTwoSeasons)

  const walkInRevenue = walkInRate * estNights
  const advanceRevenue =
    advNext * advancePrice(advNext, sp.advanceBaseRate) +
    advTwo * advancePrice(advTwo, sp.advanceBaseRate)
  const salesRevenue = walkInRevenue + advanceRevenue
  const totalNights = estNights + advNext + advTwo
  const weightedAvgRate = totalNights > 0 ? salesRevenue / totalNights : 0

  // Personnel
  const headcount = num(d.headcount)
  const wage = num(d.wage)
  const training = num(d.training)
  const turnover = num(d.turnover) / 100
  const permanentWages = headcount * wage * 6
  const temporaryWages = 0 // not a v1 decision — temp staffing derived elsewhere
  const trainingCost = training * headcount
  const newHires = Math.max(0, headcount * turnover)
  const recruitment = newHires * PARAMS.recruitCost
  const layoffs = Math.max(0, PARAMS.priorHeadcount - headcount) * PARAMS.layoffCost
  const personnelExpenses =
    permanentWages + temporaryWages + trainingCost + recruitment + layoffs

  // Direct cost (net of cumulative direct-saving effort) — SIMPLIFIED reduction curve
  const directReduction = Math.min(0.5, num(d.directCostSaving) / PARAMS.directSavingScale)
  const directCostPerNight = sp.baseDirectCost * (1 - directReduction)
  const directCost = directCostPerNight * totalNights

  const grossProfit = salesRevenue - personnelExpenses - directCost

  // Other operating expenses
  const adminReduction = Math.min(0.5, num(d.adminCostSaving) / PARAMS.adminSavingScale)
  const administration = PARAMS.baseAdmin * (1 - adminReduction)
  const marketing = num(d.marketing)
  const maintenance = num(d.maintenance)
  const costSavingEfforts = num(d.directCostSaving) + num(d.adminCostSaving)
  const otherOperatingExp =
    administration + marketing + PARAMS.rental + maintenance + costSavingEfforts

  const ebitda = salesRevenue - personnelExpenses - directCost - otherOperatingExp
  const depreciation = PARAMS.depreciation
  const ebit = ebitda - depreciation

  // Financing income/expense
  const longTermLoan = PARAMS.opening.longTermLoan + num(d.ltLoanChange)
  const interestIncome = perSeason(sp.cashAnnual) * Math.max(0, PARAMS.opening.cash)
  const interestExpenseLT = perSeason(sp.primeAnnual) * Math.max(0, longTermLoan)
  // Short-term interest is resolved in the cash flow (taken only if cash is short).

  const incomeBeforeTaxes = ebit + interestIncome - interestExpenseLT
  const taxes = PARAMS.taxRate * Math.max(0, incomeBeforeTaxes)
  const netProfit = incomeBeforeTaxes - taxes

  return {
    season,
    salesRevenue,
    walkInRevenue,
    advanceRevenue,
    totalNights,
    weightedAvgRate,
    personnelExpenses,
    permanentWages,
    temporaryWages,
    trainingCost,
    recruitment,
    layoffs,
    directCost,
    directCostPerNight,
    grossProfit,
    administration,
    marketing,
    maintenance,
    rental: PARAMS.rental,
    costSavingEfforts,
    otherOperatingExp,
    ebitda,
    depreciation,
    ebit,
    interestIncome,
    interestExpenseLT,
    incomeBeforeTaxes,
    taxes,
    netProfit,
    longTermLoan,
  }
}

// ── Balance sheet + cash flow (driven off the income statement) ───────────────────────
export function computeBalanceAndCashFlow(d, is) {
  const sp = SEASON_PARAMS[is.season]
  const o = PARAMS.opening

  // Working capital
  const receivablesClose = is.salesRevenue * (num(d.creditTerm) / PARAMS.nightsPerSeason)
  const payablesClose = is.salesRevenue * PARAMS.payablesRate
  const dReceivables = receivablesClose - o.receivables
  const dPayables = payablesClose - o.payables

  // Operating + investing cash flow (capex = 0; build is ghosted)
  const operatingCashFlow =
    is.ebitda + is.interestIncome - is.interestExpenseLT - is.taxes - dReceivables + dPayables
  const investingCashFlow = 0

  // Financing before any short-term top-up
  const dividends = num(d.dividends)
  const financingBeforeST = num(d.ltLoanChange) - dividends

  // If cash would go negative, auto-take a short-term loan to cover it (spec §10).
  const cashPreliminary = o.cash + operatingCashFlow + investingCashFlow + financingBeforeST
  const shortTermLoan = Math.max(0, -cashPreliminary)
  const interestExpenseST = perSeason(sp.primeAnnual + PARAMS.shortTermPremiumAnnual) * shortTermLoan

  const financingCashFlow = financingBeforeST + shortTermLoan
  const netChangeInCash =
    operatingCashFlow + investingCashFlow + financingCashFlow - interestExpenseST
  const cashClose = Math.max(0, o.cash + netChangeInCash)

  // Balance sheet
  const ppeNet = o.ppeNet - is.depreciation // + capex (0)
  const retainedClose = o.retainedEarnings + is.netProfit - dividends

  const totalAssets = ppeNet + receivablesClose + cashClose
  const totalEquity = o.shareCapital + retainedClose
  const totalLiabilities = is.longTermLoan + shortTermLoan + payablesClose
  const balanceCheck = Math.round(totalAssets - (totalEquity + totalLiabilities))

  return {
    // balance sheet
    ppeNet,
    receivables: receivablesClose,
    cash: cashClose,
    totalAssets,
    shareCapital: o.shareCapital,
    retainedEarnings: retainedClose,
    netProfit: is.netProfit,
    totalEquity,
    longTermLoan: is.longTermLoan,
    shortTermLoan,
    payables: payablesClose,
    totalLiabilities,
    balanceCheck, // should be 0 — surfaced so a regression is obvious
    // cash flow
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
    interestExpenseST,
    netChangeInCash,
    dividends,
  }
}

// ── Ratios (spec §10; formulas confirmed from the guide) ──────────────────────────────
export function computeRatios(is, bs) {
  const avgEquity = (PARAMS.opening.shareCapital + PARAMS.opening.retainedEarnings + bs.totalEquity) / 2
  const avgIBL = (PARAMS.opening.longTermLoan + bs.longTermLoan + bs.shortTermLoan) / 2
  const avgCash = (PARAMS.opening.cash + bs.cash) / 2
  const totalRevenue = is.salesRevenue + is.interestIncome
  const eps = is.netProfit / PARAMS.shares
  const pct = (n) => n * 100

  return {
    roce: pct((is.ebit * 2) / (avgEquity + avgIBL)), // annualized (×2 for 6-mo)
    grossProfitRatio: pct(is.salesRevenue ? is.grossProfit / is.salesRevenue : 0),
    netProfitRatio: pct(is.salesRevenue ? is.netProfit / is.salesRevenue : 0),
    gearing: pct(avgEquity ? (avgIBL - avgCash) / avgEquity : 0),
    assetTurnover: bs.totalAssets ? totalRevenue / bs.totalAssets : 0,
    dividendPayout: pct(is.netProfit ? bs.dividends / is.netProfit : 0),
    eps,
    occupancy: pct(is.totalNights / PARAMS.capacityNights),
    grossProfitPerRoom: is.grossProfit / PARAMS.roomCount,
    netProfitPerRoom: is.netProfit / PARAMS.roomCount,
  }
}

// ── Operations indicators (SIMPLIFIED, documented stand-ins for hidden internals) ─────
// These drive the Operations widgets (stress gauge, Quality Level). They are transparent
// teaching indicators, NOT reproductions of Cesim's hidden engine.

const STRESS = { nightsPerStaff: 450 } // a comfortable workload per FTE per season

export function personnelStress(d) {
  const headcount = num(d.headcount) || PARAMS.priorHeadcount
  const totalNights =
    num(d.estNightsSold) + num(d.advanceNextSeason) + num(d.advanceTwoSeasons)
  const ideal = totalNights / STRESS.nightsPerStaff
  // 50% when staffing matches the workload; rises when understaffed, falls when over.
  const ratio = headcount > 0 ? ideal / headcount : 2
  return Math.max(0, Math.min(100, 50 * ratio))
}

// Quality Level index 0–100: facility condition (maintenance) + personnel quality
// (training + wage). Diminishing returns on each input.
export function qualityLevel(d) {
  const facility = 100 * (1 - Math.exp(-num(d.maintenance) / 25000))
  const trainingQ = 100 * (1 - Math.exp(-num(d.training) / 3000))
  const wageQ = Math.min(100, (num(d.wage) / 4000) * 100)
  const personnelQ = 0.6 * trainingQ + 0.4 * wageQ
  return Math.round(0.5 * facility + 0.5 * personnelQ)
}

// Hire / layoff economics — surfaces the asymmetry (layoffs dearer than recruiting).
export function personnelChange(d) {
  const headcount = num(d.headcount)
  const delta = headcount - PARAMS.priorHeadcount
  const turnover = num(d.turnover) / 100
  const replacements = headcount * turnover
  return {
    delta,
    hiring: delta > 0,
    recruits: Math.max(0, delta) + replacements,
    layoffs: Math.max(0, -delta),
    recruitCost: (Math.max(0, delta) + replacements) * PARAMS.recruitCost,
    layoffCost: Math.max(0, -delta) * PARAMS.layoffCost,
  }
}

// ── Top-level: one call → everything the Projections modal + readouts need ────────────
export function computeProjection(decisions, season = 'summer') {
  const income = computeIncomeStatement(decisions, season)
  const balance = computeBalanceAndCashFlow(decisions, income)
  const ratios = computeRatios(income, balance)
  return { income, balance, ratios, params: PARAMS }
}
