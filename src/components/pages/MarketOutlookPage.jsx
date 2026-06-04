import { useDecisions } from '../../state/decisions'
import { PARAMS, SEASON_PARAMS } from '../../data/formulas'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'
import { StatementTable } from '../shared/StatementTable'
import { Axiom } from '../shared/Axiom'
import { Gloss } from '../shared/AcronymTooltip'
import { usd, pct, int } from '../../lib/format'

// MARKET OUTLOOK — step 3 of the decision process: read the outlook before deciding. This
// is where the deterministic parameters that feed the math actually live, so the numbers
// stop being a black box.

export function MarketOutlookPage() {
  const { season } = useDecisions()
  const sp = SEASON_PARAMS[season]
  const col = [{ key: 'v', label: 'Value' }]
  const row = (label, value, opts = {}) => ({ label, values: { v: value }, ...opts })

  const facility = [
    row('Room capacity', `${PARAMS.roomCount} rooms × ${PARAMS.nightsPerSeason} nights`),
    row('Total capacity', `${int(PARAMS.capacityNights)} nights`, { gloss: 'room-night' }),
    row('Rental / 6 months', usd(PARAMS.rental)),
    row('Depreciation / season', usd(PARAMS.depreciation), { gloss: 'Depreciation' }),
  ]
  const personnel = [
    row('Recruitment cost / person', usd(PARAMS.recruitCost)),
    row('Layoff cost / person', usd(PARAMS.layoffCost)),
    row('Prior permanent headcount', `${PARAMS.priorHeadcount} people`),
  ]
  const finance = [
    row('Tax rate', pct(PARAMS.taxRate * 100, 0)),
    row('Prime interest (annual)', pct(sp.primeAnnual * 100, 2), { gloss: 'Gearing' }),
    row('Short-term premium (annual)', pct(PARAMS.shortTermPremiumAnnual * 100, 2)),
    row('Trade payables (% of sales)', pct(PARAMS.payablesRate * 100, 2), { gloss: 'Trade payables' }),
  ]
  const costs = [
    row('Base administration cost', usd(PARAMS.baseAdmin)),
    row('Base direct cost / room-night', usd(sp.baseDirectCost)),
  ]

  return (
    <div>
      <PageHeader
        title="Market Outlook"
        subtitle="Read the season's parameters and demand picture before you decide. These are the fixed inputs the rest of the model runs on."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <Section title="Demand Outlook">
            <p className="text-[13px] leading-relaxed text-cesim-ink">
              The hotel is predominantly <span className="font-semibold">leisure-driven</span>, with
              a steadier base of business travelers in winter. Most of the year's profit is made in
              the <span className="font-semibold">summer high season</span>; the winter goal is to
              avoid losses. Competition is intensifying, so the room-nights you actually realize
              depend on rivals' actions as well as yours.
            </p>
            <Axiom lead="Summer earns; winter defends.">
              Plan to make the money in the high season and protect the downside in the low one —
              pricing and marketing should follow which guests you're chasing.
            </Axiom>
            <div className="mt-3 rounded bg-cesim-link/5 p-3 text-[12px] leading-relaxed text-cesim-ink">
              <span className="font-semibold">Estimated demand is yours to enter.</span> Because the
              true demand model is competitor-dependent and hidden, SIMCESIM uses your{' '}
              <Gloss term="estimation cell">estimate</Gloss> on the Sales page to drive the budgeted
              statements. Actual demand resolves only in the live system.
            </div>
          </Section>

          <Section title="Facility Investments">
            <StatementTable columns={col} rows={facility} />
          </Section>

          <Section title="Costs">
            <StatementTable columns={col} rows={costs} />
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Finance (%)">
            <StatementTable columns={col} rows={finance} />
          </Section>

          <Section title="Personnel">
            <StatementTable columns={col} rows={personnel} />
            <Axiom lead="Firing costs more than hiring.">
              Laying off a person costs more than recruiting one, so the cheapest plan is to staff a
              level you can hold across seasons rather than chase each peak.
            </Axiom>
          </Section>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-cesim-muted">
        Parameters vary slightly by season; values above are for the active round ({season}).
      </p>
    </div>
  )
}
