import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { advanceUnitPrice, PARAMS } from '../../data/formulas'
import { demandRefFor } from '../../data/demandModel'
import { ANCHORS, COMPLETED_ROUNDS } from '../../data/roundResults'
import { seasonOfRound, LAST_COMPLETED_ROUND } from '../../data/config'
import { FIELDS } from '../../data/fields'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'
import { PageProgressDots } from '../shared/PageProgressDots'
import { TimeframeLabel } from '../shared/TimeframeLabel'
import { DecisionField } from '../shared/DecisionField'
import { Donut } from '../shared/Donut'
import { StatementTable } from '../shared/StatementTable'
import { Readout } from '../shared/Readout'
import { Axiom } from '../shared/Axiom'
import { cn } from '../../lib/cn'
import { cap, otherSeason } from '../../lib/season'
import { usd, int, pct } from '../../lib/format'

// SALES — decisions on the left (units on fields, ⓘ on every label, the sales-mix donut);
// live read-only statements on the right. Demand is Approach A: the income statement is
// driven by the user's estimate (spec §1, §7). Alongside it, the demand-model readout shows
// what the price IMPLIES (a curve fit to real Round 1 results) — assistive, not the budget.

// Slider bounds. Rate spans the full real spread (don't cap early); nights run 0 → the
// walk-in capacity ceiling (the estNightsSold field's own max).
const RATE_MIN = 70
const RATE_MAX = 280
const RATE_STEP = 5
const NIGHTS_MAX = typeof FIELDS.estNightsSold?.max === 'number' ? FIELDS.estNightsSold.max : 9000
const NIGHTS_STEP = 50

const snap = (v, step, min, max) => Math.max(min, Math.min(max, Math.round(v / step) * step))

// Most recent COMPLETED round of a given season (for the same-season occupancy reference).
function lastRoundOfSeason(season) {
  const matches = COMPLETED_ROUNDS.filter((n) => seasonOfRound(n) === season)
  return matches.length ? Math.max(...matches) : null
}

// A slider + −/+ stepper bound to a decision field (the field row above it carries the
// label, ⓘ, tag and typed value). Steps in `step`, clamps to [min,max]. Locked on past rounds.
function FieldSlider({ fieldId, min, max, step, defaultPos, ariaLabel }) {
  const { values, setValue, readOnly } = useDecisions()
  const raw = values[fieldId]
  const cur = raw === '' || raw === null || raw === undefined ? null : Number(raw)
  const pos = cur ?? defaultPos
  const set = (v) => setValue(fieldId, snap(v, step, min, max))
  const btn = 'grid h-6 w-6 shrink-0 place-items-center rounded border border-gray-300 text-[14px] leading-none text-cesim-ink hover:border-cesim-link disabled:opacity-40'

  return (
    <div className="mt-1 flex items-center gap-1.5 px-1">
      <button type="button" disabled={readOnly} onClick={() => set(pos - step)} className={btn} aria-label={`Lower ${ariaLabel}`}>−</button>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={pos}
        disabled={readOnly}
        onChange={(e) => set(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-cesim-link disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={ariaLabel}
      />
      <button type="button" disabled={readOnly} onClick={() => set(pos + step)} className={btn} aria-label={`Raise ${ariaLabel}`}>+</button>
    </div>
  )
}

// DEMAND MODEL PROJECTIONS — the live outputs of the two-input calculator (spec demand-
// calculator addendum). The two sliders above (walk-in rate + est. nights) feed two outputs
// here — net profit and occupancy — recomputed on every move from the same deterministic
// formulas. Replaces the old single-variable price TABLE, which read all-negative because it
// ignored the nights lever (revenue = rate × nights). Assistive only; Approach A drives the budget.
function DemandOutputs() {
  const { projection, season } = useDecisions()
  const net = projection.income.netProfit
  const totalNights = projection.income.totalNights
  const occ = (totalNights / PARAMS.capacityNights) * 100
  const refRound = lastRoundOfSeason(season)
  const ref = refRound ? ANCHORS[refRound] : null
  const elasticity = demandRefFor(season).elasticity

  return (
    <div className="mt-2 rounded border border-slate-300 bg-slate-50 p-3 text-slate-700">
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-800">
        <span aria-hidden>📊</span> Demand Model Projections ({cap(season)})
      </div>
      <div className="mb-2 text-[10px] text-slate-500">Move either slider above — net profit and occupancy update live.</div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Net profit (est.)</div>
          <div className={cn('text-[22px] font-bold leading-tight tabular-nums', net >= 0 ? 'text-emerald-600' : 'text-red-600')}>{usd(net)}</div>
        </div>
        <div className="border-l border-slate-200 pl-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Occupancy</div>
          <div className="text-[22px] font-bold leading-tight tabular-nums text-cesim-ink">{pct(occ)}</div>
          {ref && <div className="text-[10px] italic text-slate-500">(last {season}: {pct(ref.occupancy, 0)})</div>}
          <div className="text-[10px] text-slate-500">{int(totalNights)} total nights sold</div>
        </div>
      </div>

      <p className="mt-2.5 text-[10px] leading-snug text-slate-500">
        Directional teaching estimate (this {season}'s elasticity ≈ {elasticity}) — net profit is Projections' bottom
        line recomputed live, all other decisions held; revenue = rate × nights. Real demand also moves with
        competitors' prices, and the slope differs by season. Your estimate still drives the official budget.
      </p>
    </div>
  )
}

export function SalesPage() {
  const { values, projection, season } = useDecisions()
  const { setPastResultsOpen, goToResults } = useUI()
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
              <FieldSlider fieldId="walkInRate" min={RATE_MIN} max={RATE_MAX} step={RATE_STEP} defaultPos={130} ariaLabel="walk-in room rate" />
              {field('estNightsSold')}
              <FieldSlider fieldId="estNightsSold" min={0} max={NIGHTS_MAX} step={NIGHTS_STEP} defaultPos={2000} ariaLabel="estimated walk-in nights" />
            </div>

            <DemandOutputs />

            {/* Yellow hint: go deeper into EITHER season's real past results */}
            <div className="mt-2 flex items-start gap-1.5 rounded border-l-2 border-amber-400 bg-amber-50 px-2 py-1.5 text-[11px] leading-snug text-amber-900">
              <span aria-hidden>💡</span>
              <span>
                Not sure what to enter? See what the hotel did{' '}
                <button type="button" onClick={() => goToResults('market', lastRoundOfSeason('summer'))} className="font-semibold underline hover:text-amber-950">last summer</button>{' '}
                or{' '}
                <button type="button" onClick={() => goToResults('market', lastRoundOfSeason('winter'))} className="font-semibold underline hover:text-amber-950">last winter</button>.
              </span>
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
