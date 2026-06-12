import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { advanceUnitPrice, PARAMS, computeIncomeStatement } from '../../data/formulas'
import { estimateWalkInNights, walkInOccupancy, marketingFactor, demandRefFor } from '../../data/demandModel'
import { ANCHORS } from '../../data/roundResults'
import { LAST_COMPLETED_ROUND } from '../../data/config'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'
import { PageProgressDots } from '../shared/PageProgressDots'
import { TimeframeLabel } from '../shared/TimeframeLabel'
import { DecisionField } from '../shared/DecisionField'
import { Donut } from '../shared/Donut'
import { StatementTable } from '../shared/StatementTable'
import { Readout } from '../shared/Readout'
import { Axiom } from '../shared/Axiom'
import { cap, otherSeason } from '../../lib/season'
import { usd, int, pct } from '../../lib/format'

// SALES — decisions on the left (units on fields, ⓘ on every label, the sales-mix donut);
// live read-only statements on the right. Demand is Approach A: the income statement is
// driven by the user's estimate (spec §1, §7). Alongside it, the demand-model readout shows
// what the price IMPLIES (a curve fit to real Round 1 results) — assistive, not the budget.

// Reference rates spanning the real walk-in observations, per season-type.
const PRICE_POINTS = { summer: [100, 120, 135, 150, 170], winter: [110, 130, 150, 200, 250] }

// Slider/stepper bounds — covers the real spread seen across rounds (~$95–$250).
const RATE_MIN = 80
const RATE_MAX = 260
const RATE_STEP = 5

// A stepper + slider on the walk-in rate (spec price-profit addendum, Part 1). Adjusts the
// rate in $5 steps and feeds the demand-model projections live. Locked on past rounds.
function RateControl() {
  const { values, setValue, readOnly } = useDecisions()
  const rate = Number(values.walkInRate) || 0
  const pos = rate || 130 // slider rests at a sensible default until a rate is set
  const set = (v) => setValue('walkInRate', Math.max(RATE_MIN, Math.min(RATE_MAX, Math.round(v / RATE_STEP) * RATE_STEP)))
  const btn = 'grid h-6 w-6 shrink-0 place-items-center rounded border border-gray-300 text-[14px] leading-none text-cesim-ink hover:border-cesim-link disabled:opacity-40'

  return (
    <div className="mt-1.5 flex items-center gap-2 px-1">
      <button type="button" disabled={readOnly} onClick={() => set(pos - RATE_STEP)} className={btn} aria-label="Lower rate $5">−</button>
      <input
        type="range"
        min={RATE_MIN}
        max={RATE_MAX}
        step={RATE_STEP}
        value={pos}
        disabled={readOnly}
        onChange={(e) => set(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-cesim-link disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Walk-in room rate"
      />
      <button type="button" disabled={readOnly} onClick={() => set(pos + RATE_STEP)} className={btn} aria-label="Raise rate $5">+</button>
      <span className="w-12 shrink-0 text-right text-[12px] font-semibold tabular-nums text-cesim-ink">{rate ? usd(rate) : '—'}</span>
    </div>
  )
}

// The grounded, SEASON-AWARE price→volume→PROFIT readout: model-suggested walk-in nights at
// the user's rate vs. their own estimate, plus a per-price table of nights, occupancy AND
// estimated net profit (spec addendum §2 + price-profit addendum). Profit per row is just
// Projections' bottom line recomputed for that rate, all other decisions held — assistive
// only; Approach A still drives the official budget.
function DemandModelReadout({ price, marketing, userEstimate, season, decisions }) {
  const p = Number(price) || 0
  const mf = marketingFactor(marketing)
  const modelNights = estimateWalkInNights(p, season, { marketingFactor: mf })
  const occ = walkInOccupancy(modelNights)
  const points = PRICE_POINTS[season] ?? PRICE_POINTS.winter
  const nearest = p > 0 ? points.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a)) : null
  const ref = demandRefFor(season)

  // Estimated net profit at a given rate + nights, holding every other decision fixed.
  const profitAt = (rate, nights) =>
    computeIncomeStatement({ ...decisions, walkInRate: rate, estNightsSold: nights }, season).netProfit
  const profitNow = p > 0 ? profitAt(p, modelNights) : 0

  return (
    <div className="mt-2 rounded border border-slate-300 bg-slate-50 p-2.5 text-[12px] text-slate-700">
      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
        <span aria-hidden>📊</span> Demand model projections ({cap(season)})
      </div>
      <div className="mb-1.5 text-[10px] text-slate-500">How your room rate moves volume — and profit.</div>
      {p > 0 ? (
        <p className="leading-snug">
          At <span className="font-bold text-cesim-ink">{usd(p)}</span>, the model expects{' '}
          <span className="font-bold text-cesim-ink">~{int(modelNights)}</span> walk-in nights{' '}
          (<span className="font-semibold">{pct(occ)}</span> occ.) →{' '}
          <span className="font-bold text-cesim-ink">{usd(profitNow)}</span> est. net profit.
          {userEstimate > 0 && (
            <> Your estimate: <span className="font-semibold text-cesim-ink">{int(userEstimate)}</span> nights.</>
          )}
        </p>
      ) : (
        <p className="leading-snug text-slate-500">Set a walk-in rate to see the price → volume → profit trade-off.</p>
      )}

      {/* Price → volume → profit, so the real trade-off is visible in one glance */}
      <table className="mt-2 w-full text-[11px] tabular-nums">
        <thead>
          <tr className="text-slate-500">
            <th className="py-0.5 text-left font-medium">Walk-in rate</th>
            <th className="py-0.5 text-right font-medium">Nights</th>
            <th className="py-0.5 text-right font-medium">Occ.</th>
            <th className="py-0.5 text-right font-medium">Net profit (est.)</th>
          </tr>
        </thead>
        <tbody>
          {points.map((pp) => {
            const n = estimateWalkInNights(pp, season)
            const on = pp === nearest
            return (
              <tr key={pp} className={on ? 'font-bold text-cesim-ink' : ''}>
                <td className="py-0.5 text-left">
                  {usd(pp)}
                  {on && <span className="ml-1 text-[9px] font-normal text-cesim-link">← you</span>}
                </td>
                <td className="py-0.5 text-right">~{int(n)}</td>
                <td className="py-0.5 text-right">{pct(walkInOccupancy(n))}</td>
                <td className="py-0.5 text-right">{usd(profitAt(pp, n))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <p className="mt-2 text-[10px] leading-snug text-slate-500">
        A simplified {season} demand curve (elasticity ≈ {ref.elasticity}) fit to real results for this season —
        directional, a teaching approximation, not the live engine. Profit is Projections' bottom line recomputed per
        rate, other decisions held. Demand still moves with competitors' prices in the live sim; your estimate drives
        the official budget. Open <span className="font-semibold">Projections</span> for the full statements.
      </p>
    </div>
  )
}

export function SalesPage() {
  const { values, projection, season } = useDecisions()
  const { setPastResultsOpen } = useUI()
  const { income } = projection

  const walkNights = Number(values.estNightsSold) || 0
  const advNext = Number(values.advanceNextSeason) || 0
  const advTwo = Number(values.advanceTwoSeasons) || 0

  const mix = [
    { label: `Walk-in (this ${season})`, value: walkNights, color: '#2f6fb0' },
    { label: `Advance — next ${otherSeason(season)}`, value: advNext, color: '#e8821e' },
    { label: 'Advance — two ahead', value: advTwo, color: '#f0b34d' },
  ]

  const field = (id) => <DecisionField fieldId={id} />

  const dash = '—'
  const salesRows = [
    { label: 'Walk-in room sales', values: { now: usd(income.walkInRevenue), d: dash, last: dash } },
    { label: 'Advance room sales', values: { now: usd(income.advanceRevenue), d: dash, last: dash } },
    { label: 'Sales revenue', bold: true, rule: true, values: { now: usd(income.salesRevenue), d: dash, last: dash } },
    { label: 'Total room-nights sold', gloss: 'room-night', indent: true, values: { now: int(income.totalNights), d: dash, last: dash } },
    { label: 'Weighted avg room rate', indent: true, values: { now: usd(income.weightedAvgRate), d: dash, last: dash } },
  ]

  const isRows = [
    { label: 'Sales revenue', bold: true, values: { now: usd(income.salesRevenue), d: '—', last: '—' } },
    { label: 'Personnel expenses', indent: true, values: { now: usd(income.personnelExpenses), d: '—', last: '—' } },
    { label: 'Direct cost', indent: true, values: { now: usd(income.directCost), d: '—', last: '—' } },
    { label: 'Gross profit', bold: true, rule: true, values: { now: usd(income.grossProfit), d: '—', last: '—' } },
    { label: 'Marketing', indent: true, help: 'The same Marketing decision from the left — shown here on the statement. One field, two places.', values: { now: usd(income.marketing), d: '—', last: '—' } },
    { label: 'Maintenance', indent: true, values: { now: usd(income.maintenance), d: '—', last: '—' } },
    { label: 'Administration', indent: true, values: { now: usd(income.administration), d: '—', last: '—' } },
    { label: 'Rental', indent: true, values: { now: usd(income.rental), d: '—', last: '—' } },
    { label: 'EBITDA', bold: true, gloss: 'EBITDA', rule: true, values: { now: usd(income.ebitda), d: '—', last: '—' } },
    { label: 'Depreciation', gloss: 'Depreciation', indent: true, values: { now: usd(income.depreciation), d: '—', last: '—' } },
    { label: 'EBIT', bold: true, gloss: 'EBIT', values: { now: usd(income.ebit), d: '—', last: '—' } },
    { label: 'Net profit', bold: true, rule: true, values: { now: usd(income.netProfit), d: '—', last: '—' } },
  ]

  const cols = [
    { key: 'now', label: `This ${cap(season)}` },
    { key: 'd', label: 'Δ%', gloss: 'Δ%' },
    { key: 'last', label: `Last ${cap(otherSeason(season))}` },
  ]

  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle="Set your price, marketing, and demand estimate — these drive the whole operating picture. Fill Sales first; Operations and Finance size to it."
        right={<PageProgressDots page="sales" />}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* ── Left: decisions ── */}
        <div className="space-y-4">
          <Section title="Walk-In Sales">
            <TimeframeLabel className="mb-1.5">This {season}</TimeframeLabel>
            <div className="space-y-1">
              {field('walkInRate')}
              <RateControl />
              {field('estNightsSold')}
            </div>

            <DemandModelReadout
              price={values.walkInRate}
              marketing={values.marketing}
              userEstimate={walkNights}
              season={season}
              decisions={values}
            />

            {/* Yellow hint: anchor your numbers to last round's actual results */}
            <button
              type="button"
              onClick={() => setPastResultsOpen(true)}
              className="mt-2 flex w-full items-center gap-1.5 rounded border-l-2 border-amber-400 bg-amber-50 px-2 py-1.5 text-left text-[11px] leading-snug text-amber-900 hover:bg-amber-100"
            >
              <span aria-hidden>💡</span>
              <span>
                Not sure what to enter? <span className="font-semibold underline">See what the hotel did last {otherSeason(season)} →</span>
              </span>
            </button>

            {/* Make the 9,000 tangible, right where you enter the estimate */}
            <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-2.5">
              <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0.5 text-[13px] text-cesim-ink">
                <span><span className="font-bold">{int(PARAMS.roomCount)}</span> rooms</span>
                <span className="text-cesim-muted">×</span>
                <span><span className="font-bold">{int(PARAMS.nightsPerSeason)}</span> nights</span>
                <span className="text-cesim-muted">=</span>
                <span><span className="font-bold">{int(PARAMS.capacityNights)}</span> room-nights to fill</span>
              </div>
              <div className="mt-1 text-center text-[11px] text-cesim-muted">
                your forecast fills{' '}
                <span className="font-semibold text-cesim-ink">{int(income.totalNights)}</span> of{' '}
                {int(PARAMS.capacityNights)} ·{' '}
                <span className="font-semibold text-cesim-ink">
                  {pct((income.totalNights / PARAMS.capacityNights) * 100)}
                </span>{' '}
                occupancy
              </div>
            </div>

            <Axiom lead="What's a room-night?">
              One room for one night. With {int(PARAMS.roomCount)} rooms open {int(PARAMS.nightsPerSeason)} nights
              a season, you have {int(PARAMS.capacityNights)} room-nights to sell — and any you don't fill
              tonight are gone for good.
            </Axiom>

            <div className="mt-2 space-y-1">{field('marketing')}</div>
            <button
              type="button"
              onClick={() => setPastResultsOpen(true)}
              className="mt-1 flex w-full items-center gap-1.5 rounded border-l-2 border-amber-400 bg-amber-50 px-2 py-1 text-left text-[11px] leading-snug text-amber-900 hover:bg-amber-100"
            >
              <span aria-hidden>💡</span>
              <span>
                Last {otherSeason(season)} the hotel spent {usd(ANCHORS[LAST_COMPLETED_ROUND].marketing)} on marketing.{' '}
                <span className="font-semibold underline">See the recap →</span>
              </span>
            </button>

            <div className="mt-4 border-t border-gray-100 pt-3">
              <Donut data={mix} unit="nights" />
            </div>
          </Section>

          <Section title="Advance Sales to Travel Agencies">
            <p className="mb-2 text-[11px] text-cesim-muted">
              Pre-sell future room-nights to agencies now, for a season ahead.
            </p>
            <div className="space-y-1">
              <TimeframeLabel>Next {otherSeason(season)}</TimeframeLabel>
              {field('advanceNextSeason')}
              <Readout label="Price per night (derived)" value={`${usd(advanceUnitPrice(advNext, season))} / night`} help="Falls as you offer more nights — a volume discount. Derived, not entered." />

              <TimeframeLabel className="mt-3">Two seasons ahead ({season})</TimeframeLabel>
              {field('advanceTwoSeasons')}
              <Readout label="Price per night (derived)" value={`${usd(advanceUnitPrice(advTwo, season))} / night`} help="Falls as you offer more nights — a volume discount. Derived, not entered." />
            </div>
            <Axiom lead="Volume cuts price.">
              The more nights you offer agencies, the less they pay per night — and the two windows
              compete for the same rooms. Pre-selling smooths demand but caps your upside on those nights.
            </Axiom>
          </Section>
        </div>

        {/* ── Right: read-only statements ── */}
        <div className="space-y-4">
          <Section title={`Sales for This ${cap(season)}`}>
            <StatementTable columns={cols} rows={salesRows} />
            <p className="mt-2 text-[11px] text-cesim-muted">
              Δ% and last-season columns populate once round-over-round results exist (v2). Figures are a forecast — open <span className="font-semibold">Projections</span> for the full statements.
            </p>
          </Section>

          <Section title="Income Statement (Summary)">
            <StatementTable columns={cols} rows={isRows} />
          </Section>
        </div>
      </div>
    </div>
  )
}
