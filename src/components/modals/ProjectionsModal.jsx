import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { StatementTable } from '../shared/StatementTable'
import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { cn } from '../../lib/cn'
import { usd } from '../../lib/format'

// The Projections lightbox (spec §10): the same Income statement / Balance sheet view the
// original opens from any decision page — but rendered as a proper modal (scrim + X) and
// labeled clearly as a FORECAST. Reinforces the input→output mental model.

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-b-2 px-3 py-1.5 text-[13px]',
        active ? 'border-cesim-link font-semibold text-cesim-link' : 'border-transparent text-cesim-muted hover:text-cesim-ink',
      )}
    >
      {children}
    </button>
  )
}

export function ProjectionsModal() {
  const { projectionsOpen, setProjectionsOpen } = useUI()
  const { projection } = useDecisions()
  const [tab, setTab] = useState('income')
  const { income, balance } = projection

  const col = [{ key: 'v', label: 'This round (forecast)' }]

  const incomeRows = [
    { label: 'Sales revenue', bold: true, values: { v: usd(income.salesRevenue) } },
    { label: 'Personnel expenses', indent: true, values: { v: usd(income.personnelExpenses) } },
    { label: 'Direct cost', indent: true, values: { v: usd(income.directCost) } },
    { label: 'Gross profit', bold: true, rule: true, values: { v: usd(income.grossProfit) } },
    { label: 'Administration', indent: true, values: { v: usd(income.administration) } },
    { label: 'Marketing', indent: true, values: { v: usd(income.marketing) } },
    { label: 'Maintenance', indent: true, values: { v: usd(income.maintenance) } },
    { label: 'Rental', indent: true, values: { v: usd(income.rental) } },
    { label: 'Cost-saving efforts', indent: true, values: { v: usd(income.costSavingEfforts) } },
    { label: 'EBITDA', bold: true, gloss: 'EBITDA', rule: true, values: { v: usd(income.ebitda) } },
    { label: 'Depreciation', gloss: 'Depreciation', indent: true, values: { v: usd(-income.depreciation) } },
    { label: 'EBIT', bold: true, gloss: 'EBIT', values: { v: usd(income.ebit) } },
    { label: 'Interest income', indent: true, values: { v: usd(income.interestIncome) } },
    { label: 'Interest expense', indent: true, values: { v: usd(-income.interestExpenseLT - balance.interestExpenseST) } },
    { label: 'Income before taxes', bold: true, rule: true, values: { v: usd(income.incomeBeforeTaxes) } },
    { label: 'Direct taxes (30%)', indent: true, values: { v: usd(-income.taxes) } },
    { label: 'Net profit', bold: true, rule: true, values: { v: usd(income.netProfit) } },
  ]

  const balanceRows = [
    { label: 'ASSETS', bold: true, values: { v: '' } },
    { label: 'Property, plant & equipment', indent: true, values: { v: usd(balance.ppeNet) } },
    { label: 'Trade receivables', gloss: 'Trade receivables', indent: true, values: { v: usd(balance.receivables) } },
    { label: 'Cash', indent: true, values: { v: usd(balance.cash) } },
    { label: 'Total assets', bold: true, rule: true, values: { v: usd(balance.totalAssets) } },
    { label: "SHAREHOLDERS' EQUITY", bold: true, values: { v: '' } },
    { label: 'Share capital', indent: true, values: { v: usd(balance.shareCapital) } },
    { label: 'Retained earnings', indent: true, values: { v: usd(balance.retainedEarnings) } },
    { label: 'Total equity', bold: true, rule: true, values: { v: usd(balance.totalEquity) } },
    { label: 'LIABILITIES', bold: true, values: { v: '' } },
    { label: 'Long-term loans', indent: true, values: { v: usd(balance.longTermLoan) } },
    { label: 'Short-term loans', indent: true, values: { v: usd(balance.shortTermLoan) } },
    { label: 'Trade payables', gloss: 'Trade payables', indent: true, values: { v: usd(balance.payables) } },
    { label: 'Total liabilities', bold: true, rule: true, values: { v: usd(balance.totalLiabilities) } },
    { label: 'Equity + liabilities', bold: true, values: { v: usd(balance.totalEquity + balance.totalLiabilities) } },
  ]

  return (
    <Modal
      open={projectionsOpen}
      onClose={() => setProjectionsOpen(false)}
      title="Projections"
      subtitle="A forecast, not a result — updated as you make decisions. Actual results at the deadline will differ."
      width="max-w-2xl"
    >
      <div className="mb-3 flex gap-1 border-b border-gray-200">
        <Tab active={tab === 'income'} onClick={() => setTab('income')}>Income statement</Tab>
        <Tab active={tab === 'balance'} onClick={() => setTab('balance')}>Balance sheet</Tab>
      </div>

      {tab === 'income' ? (
        <StatementTable columns={col} rows={incomeRows} />
      ) : (
        <>
          <StatementTable columns={col} rows={balanceRows} />
          <p className={cn('mt-2 text-[11px]', balance.balanceCheck === 0 ? 'text-emerald-600' : 'text-rose-600')}>
            {balance.balanceCheck === 0
              ? '✓ Balanced: total assets = equity + liabilities.'
              : `⚠ Off by ${usd(balance.balanceCheck)} — this should never happen.`}
          </p>
        </>
      )}
    </Modal>
  )
}
