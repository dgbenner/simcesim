import { useState } from 'react'
import { useUI } from '../../state/ui'
import { Gloss } from '../shared/AcronymTooltip'
import { cn } from '../../lib/cn'
import { usd } from '../../lib/format'
import { ROUNDS_DATA, ROUND_META, RESULT_TEAMS, COMPLETED_ROUNDS } from '../../data/roundResults'

// RESULTS — read-only review of any COMPLETED round (spec addendum). The round selector
// switches which round you're reviewing (data from roundResults.js, transcribed from the
// real exports); a banner makes clear past rounds are locked. Seven sub-tabs, all four
// teams shown by name with full figures; Hotel Red is highlighted as "you" (competitor
// data is now visible for comparison — only the people stay anonymized to initials).

const RESULT_TABS = [
  { id: 'income', label: 'Income statement' },
  { id: 'balance', label: 'Balance sheet' },
  { id: 'market', label: 'Market report' },
  { id: 'operations', label: 'Operations report' },
  { id: 'cashflow', label: 'Cash flow' },
  { id: 'ratios', label: 'Ratios' },
  { id: 'sorting', label: 'Sorting' },
]

function fmtVal(v, fmt) {
  if (v === null || v === undefined || v === '') return ''
  switch (fmt) {
    case 'pct':
      return `${v.toFixed(2)}%`
    case 'num':
      return v.toFixed(2)
    case 'int':
      return Math.round(v).toLocaleString('en-US')
    case 'rate':
      return `$${v.toFixed(2)}`
    case 'nights':
      return Math.round(v).toLocaleString('en-US')
    default:
      return usd(v)
  }
}

function TeamTable({ rows }) {
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-surface-tablehead">
          <th className="px-2 py-1.5 text-left" />
          {RESULT_TEAMS.map((t) => (
            <th key={t.key} className={cn('px-2 py-1.5 text-right font-semibold text-cesim-ink', t.active && 'bg-cesim-link/5')}>
              {t.name}
              {t.active && <span className="ml-1 text-[10px] font-normal text-cesim-link">(you)</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) =>
          row.heading ? (
            <tr key={i} className="bg-gray-50">
              <td colSpan={RESULT_TEAMS.length + 1} className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-cesim-rule">
                {row.heading}
              </td>
            </tr>
          ) : (
            <tr key={i} className={cn('border-b border-gray-100', row.rule && 'border-t border-gray-300', row.ghostRow && 'opacity-40')}>
              <td className={cn('px-2 py-[3px] text-left', row.bold ? 'font-bold text-cesim-ink' : 'text-cesim-ink', row.indent && 'pl-5 text-cesim-muted')}>
                {row.gloss ? <Gloss term={row.gloss}>{row.label}</Gloss> : row.label}
              </td>
              {RESULT_TEAMS.map((t, ci) => (
                <td key={t.key} className={cn('px-2 py-[3px] text-right tabular-nums text-cesim-ink', row.bold && 'font-bold', t.active && 'bg-cesim-link/5 font-semibold')}>
                  {fmtVal(row.vals[ci], row.fmt)}
                </td>
              ))}
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}

function ChartPlaceholder({ label }) {
  return (
    <div className="mt-3 grid h-24 place-items-center rounded border border-dashed border-gray-300 bg-gray-50 text-[11px] text-gray-400">
      {label} — cross-team chart (all four teams)
    </div>
  )
}

// Functional round dropdown — switches which completed round is under review.
function RoundPicker({ viewRound, setViewRound }) {
  const [open, setOpen] = useState(false)
  const meta = ROUND_META[viewRound]
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded border border-gray-300 bg-white px-2 py-1 text-[12px] font-semibold text-cesim-ink hover:border-cesim-link"
        title="Review a completed round"
      >
        {meta?.label ?? `Round ${viewRound}`} ▾
      </button>
      {open && (
        <ul className="absolute right-0 z-30 mt-1 w-44 rounded border border-gray-200 bg-white py-1 shadow-lg">
          {COMPLETED_ROUNDS.map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => { setViewRound(n); setOpen(false) }}
                className={cn('flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px]', n === viewRound ? 'bg-cesim-link/10 font-semibold text-cesim-link' : 'text-cesim-ink hover:bg-gray-50')}
              >
                <span>{ROUND_META[n].label}</span>
                <span className="text-[10px] text-cesim-muted">completed</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ResultsUtilities({ viewRound, setViewRound }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 text-[12px] text-gray-400" title="Export utilities — disabled">
        <span>XLS</span>
        <span>🖨</span>
        <span>▤</span>
      </span>
      <span className="ml-1 cursor-default rounded border border-gray-300 px-2 py-1 text-[12px] text-gray-400" title="Single universe — disabled">
        Universe 1 ▾
      </span>
      <RoundPicker viewRound={viewRound} setViewRound={setViewRound} />
    </div>
  )
}

function TabPanel({ title, viewRound, setViewRound, children }) {
  const meta = ROUND_META[viewRound]
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-cesim-ink">{title}</h1>
          <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">
            {meta?.label} · completed round
          </div>
        </div>
        <ResultsUtilities viewRound={viewRound} setViewRound={setViewRound} />
      </div>
      {children}
    </div>
  )
}

function SortingTable({ rows }) {
  const teamName = (key) => RESULT_TEAMS.find((t) => t.key === key)?.name ?? key
  const COLS = [
    { key: 'tsr', label: 'Cumulative TSR % pa', fmt: 'pct' },
    { key: 'ebitdaPrev', label: 'EBITDA, previous 6 months', fmt: 'usd' },
    { key: 'ebitdaRoll', label: 'EBITDA, rolling 12 months', fmt: 'usd' },
    { key: 'shareDom', label: 'Market share %, domestic', fmt: 'pct' },
    { key: 'occDom', label: 'Occupancy %, domestic', fmt: 'pct' },
  ]
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-surface-tablehead">
          <th className="px-2 py-1.5 text-left font-semibold text-cesim-muted">Team</th>
          {COLS.map((c) => (
            <th key={c.key} className="px-2 py-1.5 text-right font-semibold text-cesim-muted">{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const active = row.team === 'red'
          return (
            <tr key={row.team} className={cn('border-b border-gray-100', active && 'bg-cesim-link/5')}>
              <td className={cn('px-2 py-1.5 text-left', active ? 'font-bold text-cesim-ink' : 'text-cesim-muted')}>
                {teamName(row.team)}
                {active && <span className="ml-1 text-[10px] font-normal text-cesim-link">(you)</span>}
              </td>
              {COLS.map((c) => (
                <td key={c.key} className={cn('px-2 py-1.5 text-right tabular-nums', active ? 'font-semibold text-cesim-ink' : 'text-cesim-muted')}>
                  {fmtVal(row[c.key], c.fmt)}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function ResultsPage() {
  const { resultsTab, setResultsTab, viewRound, setViewRound } = useUI()
  const data = ROUNDS_DATA[viewRound] ?? ROUNDS_DATA[COMPLETED_ROUNDS[COMPLETED_ROUNDS.length - 1]]
  const meta = ROUND_META[viewRound]
  const panelProps = { viewRound, setViewRound }

  return (
    <div>
      {/* Review-only banner */}
      <div className="mx-auto mb-3 flex max-w-[1180px] items-center gap-2 rounded border-l-2 border-amber-400 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
        <span aria-hidden>🔒</span>
        <span>
          <span className="font-semibold">{meta?.label} — completed.</span> Review only; decisions are locked. Each round
          already determined everything after it. To experiment, open the{' '}
          <span className="font-semibold">Sandbox</span> round in Decisions.
        </span>
      </div>

      {/* Results sub-nav */}
      <div className="mb-4 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center px-1">
          <ul className="flex">
            {RESULT_TABS.map((t) => {
              const active = t.id === resultsTab
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setResultsTab(t.id)}
                    className={cn('border-b-2 px-3 py-2 text-[12px] transition-colors', active ? 'border-cesim-link font-semibold text-cesim-link' : 'border-transparent text-cesim-muted hover:text-cesim-ink')}
                  >
                    {t.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {resultsTab === 'income' && (
        <TabPanel title="Income statement" {...panelProps}>
          <TeamTable rows={data.income} />
          <ChartPlaceholder label="Income and costs" />
        </TabPanel>
      )}

      {resultsTab === 'balance' && (
        <TabPanel title="Balance sheet" {...panelProps}>
          <TeamTable rows={data.balance} />
          <ChartPlaceholder label="Assets, equity & liabilities" />
        </TabPanel>
      )}

      {resultsTab === 'market' && (
        <TabPanel title="Market report" {...panelProps}>
          <div className="mb-2 text-[12px] font-bold tracking-tight text-cesim-rule">Room rates</div>
          <TeamTable rows={data.market.roomRates} />
          <div className="mb-2 mt-5 text-[12px] font-bold tracking-tight text-cesim-rule">Room sales and nights sold</div>
          <TeamTable rows={data.market.salesAndNights} />
          <div className="mb-2 mt-5 text-[12px] font-bold tracking-tight text-cesim-rule">Advance sales to travel agencies</div>
          <TeamTable rows={data.market.advance} />
          <div className="mb-2 mt-5 text-[12px] font-bold tracking-tight text-cesim-rule">Total market</div>
          <TeamTable rows={data.market.totalMarket} />
          <ChartPlaceholder label="Room sales & nights sold" />
        </TabPanel>
      )}

      {resultsTab === 'operations' && (
        <TabPanel title="Operations report" {...panelProps}>
          <TeamTable rows={data.operations} />
          <ChartPlaceholder label="Quality level & personnel stress" />
        </TabPanel>
      )}

      {resultsTab === 'cashflow' && (
        <TabPanel title="Cash flow statement" {...panelProps}>
          <TeamTable rows={data.cashflow} />
        </TabPanel>
      )}

      {resultsTab === 'ratios' && (
        <TabPanel title="Ratios — the scoreboard" {...panelProps}>
          <TeamTable rows={data.ratios} />
          <ChartPlaceholder label="Cumulative total shareholder return" />
        </TabPanel>
      )}

      {resultsTab === 'sorting' && (
        <TabPanel title="Sorting — league table" {...panelProps}>
          <SortingTable rows={data.sorting} />
          <p className="mt-3 text-[11px] text-cesim-muted">
            The cross-team ranking. Competitor rows are shown for context; only Hotel Red is your team.
          </p>
        </TabPanel>
      )}

      <p className="mx-auto mt-3 max-w-[1180px] px-1 text-[11px] text-cesim-muted">
        Read-only. Figures transcribed from the real {meta?.label} export; all values in USD.
      </p>
    </div>
  )
}
