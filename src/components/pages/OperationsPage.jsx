import { useDecisions } from '../../state/decisions'
import { personnelStress, qualityLevel, personnelChange, PARAMS } from '../../data/formulas'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'
import { PageProgressDots } from '../shared/PageProgressDots'
import { TimeframeLabel } from '../shared/TimeframeLabel'
import { DecisionField } from '../shared/DecisionField'
import { Readout } from '../shared/Readout'
import { Gauge } from '../shared/Gauge'
import { StatementTable } from '../shared/StatementTable'
import { Axiom } from '../shared/Axiom'
import { InfoIcon } from '../shared/InfoIcon'
import { usd, int, pct, dec2 } from '../../lib/format'

// OPERATIONS — size personnel, maintenance, and cost effort to the demand set in Sales.
// Capacity expansion is ghosted (out of scope). The stress gauge + Quality Level
// indicators are SIMPLIFIED teaching stand-ins. The hire/layoff asymmetry is surfaced.

function QualityBar({ value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-3 w-full max-w-[200px] overflow-hidden rounded bg-gray-200">
        <div className="h-full bg-cesim-rule" style={{ width: `${value}%` }} />
      </div>
      <div className="mt-1.5 text-[18px] font-bold leading-none text-cesim-ink">
        {value}
        <span className="text-[12px] font-normal text-cesim-muted"> / 100</span>
      </div>
      <div className="mt-0.5 flex items-center text-[12px] font-semibold text-cesim-muted">
        Quality Level
        <InfoIcon
          label="Quality Level"
          help="Facility condition + personnel quality, as guests experience it. It supports demand and the price you can charge."
        />
      </div>
    </div>
  )
}

export function OperationsPage() {
  const { values, projection, season } = useDecisions()
  const { income } = projection

  const stress = personnelStress(values)
  const quality = qualityLevel(values)
  const change = personnelChange(values)
  const totalNights = income.totalNights

  const field = (id) => (
    <DecisionField fieldId={id} />
  )

  const personnelRows = [
    { label: 'Permanent wages', indent: true, values: { v: usd(income.permanentWages) } },
    { label: 'Training', indent: true, values: { v: usd(income.trainingCost) } },
    { label: 'Recruitment', indent: true, values: { v: usd(income.recruitment) } },
    { label: 'Layoffs', indent: true, values: { v: usd(income.layoffs) } },
    { label: 'Total personnel expenses', bold: true, rule: true, values: { v: usd(income.personnelExpenses) } },
  ]

  return (
    <div>
      <PageHeader
        title="Operations"
        subtitle="Staff, maintain, and run the hotel for the demand you set in Sales — without over- or under-building the team."
        right={<PageProgressDots page="operations" />}
      />

      {/* Top widgets */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Section title="Personnel Stress">
          <Gauge value={stress} label="Stress Level" />
          <p className="mt-1 text-center text-[11px] text-cesim-muted">
            Rises when understaffed for the room-nights served.
          </p>
        </Section>
        <Section title="Quality">
          <div className="py-3">
            <QualityBar value={quality} />
          </div>
        </Section>
        <Section title="Capacity vs. Sold">
          <div className="space-y-1 pt-1">
            <Readout label="Capacity" gloss="room-night" value={`${int(PARAMS.capacityNights)} nights`} />
            <Readout label="Forecast sold" value={`${int(totalNights)} nights`} />
            <Readout label="Occupancy" gloss="Occupancy" value={pct((totalNights / PARAMS.capacityNights) * 100)} bold />
          </div>
        </Section>
      </div>

      <TimeframeLabel className="mb-2">This {season}</TimeframeLabel>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Left: facilities, investments, cost saving */}
        <div className="space-y-4">
          <Section title="Investments">
            {field('capacityChange')}
            <p className="mt-1 text-[11px] text-cesim-muted">
              Capacity expansion is out of scope for this course — there is no demand growth to build for.
            </p>
          </Section>

          <Section title="Condition and Maintenance">
            {field('maintenance')}
            <Axiom lead="Quality compounds.">
              Maintenance and training pay back over many rounds, not one. Let condition slip and you
              lose both demand and the rate you can charge — and it's slow to rebuild.
            </Axiom>
          </Section>

          <Section title="Cost Saving Efforts">
            <div className="space-y-1">
              {field('directCostSaving')}
              {field('adminCostSaving')}
            </div>
            <Axiom lead="Savings stack.">
              Cost-saving effort is cumulative across rounds — a dollar spent now keeps paying down
              costs every future season, so early effort outweighs late effort.
            </Axiom>
          </Section>
        </div>

        {/* Right: personnel */}
        <div className="space-y-4">
          <Section title="Personnel">
            <div className="space-y-1">
              {field('headcount')}
              {field('wage')}
              {field('turnover')}
              {field('training')}
            </div>

            <Axiom lead="Hiring is cheaper than firing.">
              Recruiting costs {usd(PARAMS.recruitCost)}/person; layoffs cost {usd(PARAMS.layoffCost)}/person —
              so round-trip churn is expensive. Staff to a level you can hold, not to one season's peak.
            </Axiom>

            <div className="mt-3 space-y-1">
              <Readout
                label={change.hiring ? 'Net hires this round' : change.delta < 0 ? 'Net layoffs this round' : 'Headcount change'}
                value={change.delta === 0 ? 'none' : dec2(Math.abs(change.delta)) + ' people'}
                help="Versus last round's permanent headcount."
              />
              <Readout label="Recruitment cost" value={usd(change.recruitCost)} help="New hires + replacements for turnover, at the recruit rate." />
              <Readout label="Layoff cost" value={usd(change.layoffCost)} help="Only if you cut below last round's headcount — at the higher layoff rate." />
            </div>
          </Section>

          <Section title="Personnel Expenses">
            <StatementTable
              columns={[{ key: 'v', label: 'This Round' }]}
              rows={personnelRows}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}
