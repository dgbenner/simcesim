import { useDecisions } from '../../state/decisions'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'
import { PageProgressDots } from '../shared/PageProgressDots'
import { TimeframeLabel } from '../shared/TimeframeLabel'
import { DecisionField } from '../shared/DecisionField'
import { StatementTable } from '../shared/StatementTable'
import { Axiom } from '../shared/Axiom'
import { Gloss } from '../shared/AcronymTooltip'
import { usd, pct, dec2 } from '../../lib/format'

// FINANCE — financing decisions on the left + the cash flow statement; key figures
// (ratios) on the right. This page is densest with acronym tooltips (spec §11).

export function FinancePage() {
  const { projection, season } = useDecisions()
  const { income, balance, ratios } = projection

  const field = (id) => <DecisionField fieldId={id} />

  const oneCol = [{ key: 'v', label: 'This Round' }]

  const cashRows = [
    { label: 'EBITDA', gloss: 'EBITDA', values: { v: usd(income.ebitda) } },
    { label: 'Financing income', indent: true, values: { v: usd(income.interestIncome) } },
    { label: 'Financing expense', indent: true, values: { v: usd(-income.interestExpenseLT - balance.interestExpenseST) } },
    { label: 'Direct taxes', indent: true, values: { v: usd(-income.taxes) } },
    { label: 'Change in working capital', indent: true, help: 'The cash effect of receivables (driven by credit term) and payables.', values: { v: '' } },
    { label: 'Net operating cash flow', bold: true, rule: true, values: { v: usd(balance.operatingCashFlow) } },
    { label: 'Net investment cash flow', values: { v: usd(balance.investingCashFlow) } },
    { label: 'Δ long-term loans', gloss: 'Δ%', indent: true, values: { v: usd(income.longTermLoan - 3345725) } },
    { label: 'Δ short-term loans (auto)', indent: true, help: 'Drawn automatically only if cash would otherwise go negative.', values: { v: usd(balance.shortTermLoan) } },
    { label: 'Dividends paid', indent: true, values: { v: usd(-balance.dividends) } },
    { label: 'Net financing cash flow', bold: true, rule: true, values: { v: usd(balance.financingCashFlow) } },
    { label: 'Net change in cash', bold: true, values: { v: usd(balance.netChangeInCash) } },
    { label: 'Cash at end of period', bold: true, rule: true, values: { v: usd(balance.cash) } },
  ]

  const figureRows = [
    { label: 'ROCE (annual)', gloss: 'ROCE', values: { v: pct(ratios.roce) } },
    { label: 'Gross profit ratio', values: { v: pct(ratios.grossProfitRatio) } },
    { label: 'Net profit ratio', values: { v: pct(ratios.netProfitRatio) } },
    { label: 'Gearing', gloss: 'Gearing', values: { v: pct(ratios.gearing) } },
    { label: 'Asset turnover', values: { v: dec2(ratios.assetTurnover) } },
    { label: 'Dividend payout', values: { v: pct(ratios.dividendPayout) } },
    { label: 'EPS', gloss: 'EPS', values: { v: usd(ratios.eps) } },
    { label: 'P/E', gloss: 'P/E', help: 'Needs a share price, which resolves in the live market (TSR) — out of scope here.', values: { v: '—' } },
  ]

  const opRows = [
    { label: 'Hotel occupancy', gloss: 'Occupancy', values: { v: pct(ratios.occupancy) } },
    { label: 'Gross profit per room', values: { v: usd(ratios.grossProfitPerRoom) } },
    { label: 'Net profit per room', values: { v: usd(ratios.netProfitPerRoom) } },
    { label: 'Number of shares', values: { v: dec2(projection.params.shares).replace('.00', '') } },
  ]

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Set loans, dividends, and credit terms last — once the operating picture and the cash it throws off are clear."
        right={<PageProgressDots page="finance" />}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Left: decisions + cash flow */}
        <div className="space-y-4">
          <Section title="Financing Decisions">
            <TimeframeLabel className="mb-1.5">This {season}</TimeframeLabel>
            <div className="space-y-1">
              {field('ltLoanChange')}
              {field('dividends')}
              {field('creditTerm')}
            </div>
            <p className="mt-2 text-[11px] leading-snug text-cesim-muted">
              Borrowing raises cash now but lifts interest and <Gloss term="Gearing">gearing</Gloss>.
              Dividends pay only from retained earnings. A longer credit term ties up cash in{' '}
              <Gloss term="Trade receivables">receivables</Gloss>.
            </p>
            <Axiom lead="Dividends come from profit, not loans.">
              You can only pay out of retained earnings you've actually kept — borrowing to fund a
              dividend isn't allowed. And more debt lifts returns in good years but deepens losses in
              bad ones.
            </Axiom>
          </Section>

          <Section title="Cash Flow Statement">
            <StatementTable columns={oneCol} rows={cashRows} />
          </Section>
        </div>

        {/* Right: figures */}
        <div className="space-y-4">
          <Section title="Financial Figures">
            <StatementTable columns={oneCol} rows={figureRows} />
            <Axiom lead="One number wins the game.">
              All of these ladder up to <Gloss term="TSR">cumulative TSR</Gloss> — share-price growth
              plus dividends. That's the scoreboard the course is graded on.
            </Axiom>
          </Section>

          <Section title="Operational Figures">
            <StatementTable columns={oneCol} rows={opRows} />
          </Section>
        </div>
      </div>
    </div>
  )
}
