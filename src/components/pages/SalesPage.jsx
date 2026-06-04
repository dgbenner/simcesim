import { useDecisions } from '../../state/decisions'
import { advanceUnitPrice, PARAMS } from '../../data/formulas'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'
import { PageProgressDots } from '../shared/PageProgressDots'
import { DecisionField } from '../shared/DecisionField'
import { Donut } from '../shared/Donut'
import { StatementTable } from '../shared/StatementTable'
import { Readout } from '../shared/Readout'
import { Axiom } from '../shared/Axiom'
import { usd, int, pct } from '../../lib/format'

// SALES — decisions on the left (units on fields, ⓘ on every label, the sales-mix donut);
// live read-only statements on the right. Demand is Approach A: the income statement is
// driven by the user's estimate (spec §1, §7).

export function SalesPage() {
  const { values, projection, season } = useDecisions()
  const { income } = projection

  const walkNights = Number(values.estNightsSold) || 0
  const advNext = Number(values.advanceNextSeason) || 0
  const advTwo = Number(values.advanceTwoSeasons) || 0

  const mix = [
    { label: 'Walk-in (this season)', value: walkNights, color: '#2f6fb0' },
    { label: 'Advance — next season', value: advNext, color: '#e8821e' },
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
    { key: 'now', label: 'This Season' },
    { key: 'd', label: 'Δ%', gloss: 'Δ%' },
    { key: 'last', label: 'Last Season' },
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
            <div className="space-y-1">
              {field('walkInRate')}
              {field('estNightsSold')}
            </div>

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

            <div className="mt-4 border-t border-gray-100 pt-3">
              <Donut data={mix} unit="nights" />
            </div>
          </Section>

          <Section title="Advance Sales to Travel Agencies">
            <p className="mb-2 text-[11px] text-cesim-muted">
              Pre-sell future room-nights to agencies now, for a season ahead.
            </p>
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">Next season (winter)</div>
              {field('advanceNextSeason')}
              <Readout label="Price per night (derived)" value={`${usd(advanceUnitPrice(advNext, season))} / night`} help="Falls as you offer more nights — a volume discount. Derived, not entered." />

              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-cesim-muted">Two seasons ahead (summer)</div>
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
          <Section title="Sales for This Season">
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
