import { useUI } from '../../state/ui'
import { Gloss } from '../shared/AcronymTooltip'
import { cn } from '../../lib/cn'
import { usd } from '../../lib/format'
import {
  LAST_ROUND,
  RESULT_TEAMS,
  INCOME,
  BALANCE,
  MARKET,
  OPERATIONS,
  CASHFLOW,
  RATIOS,
  SORTING_COLUMNS,
  SORTING_ROWS,
} from '../../data/lastRoundResults'

// RESULTS — read-only historical view (spec addendum). Seven sub-tabs, four team columns
// with only Hotel Red active (competitors ghosted), disabled utilities, and the round
// selector top-right. Data is seeded from screenshots (see lastRoundResults.js).

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
  if (v === null || v === undefined) return ''
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

// A four-team table. Non-active (competitor) columns render ghosted.
function TeamTable({ rows }) {
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-surface-tablehead">
          <th className="px-2 py-1.5 text-left" />
          {RESULT_TEAMS.map((t) => (
            <th
              key={t.key}
              className={cn(
                'px-2 py-1.5 text-right font-semibold',
                t.active ? 'text-cesim-ink' : 'text-cesim-muted opacity-40',
              )}
            >
              {t.name}
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
            <tr
              key={i}
              className={cn(
                'border-b border-gray-100',
                row.rule && 'border-t border-gray-300',
                row.ghostRow && 'opacity-40',
              )}
            >
              <td
                className={cn(
                  'px-2 py-[3px] text-left',
                  row.bold ? 'font-bold text-cesim-ink' : 'text-cesim-ink',
                  row.indent && 'pl-5 text-cesim-muted',
                )}
              >
                {row.gloss ? <Gloss term={row.gloss}>{row.label}</Gloss> : row.label}
              </td>
              {RESULT_TEAMS.map((t, ci) => (
                <td
                  key={t.key}
                  className={cn(
                    'px-2 py-[3px] text-right tabular-nums',
                    t.active
                      ? row.bold
                        ? 'font-bold text-cesim-ink'
                        : 'text-cesim-ink'
                      : 'text-cesim-muted opacity-40',
                  )}
                >
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

// A greyed placeholder standing in for a competitor-comparison chart (no chart library).
function ChartPlaceholder({ label }) {
  return (
    <div className="mt-3 grid h-24 place-items-center rounded border border-dashed border-gray-300 bg-gray-50 text-[11px] text-gray-400">
      {label} — cross-team chart (competitors ghosted)
    </div>
  )
}

// Disabled utility icons + Universe/Round selectors (top-right of Results pages).
function ResultsUtilities() {
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
      <span className="cursor-default rounded border border-gray-300 bg-white px-2 py-1 text-[12px] font-semibold text-cesim-ink" title="Viewing the last completed round">
        {LAST_ROUND.label} ▾
      </span>
    </div>
  )
}

function TabPanel({ title, children }) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-cesim-ink">{title}</h1>
          <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">
            {LAST_ROUND.label} · last completed round
          </div>
        </div>
        <ResultsUtilities />
      </div>
      {children}
    </div>
  )
}

function SortingTable() {
  const teamName = (key) => RESULT_TEAMS.find((t) => t.key === key)?.name ?? key
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-surface-tablehead">
          <th className="px-2 py-1.5 text-left font-semibold text-cesim-muted">Team</th>
          {SORTING_COLUMNS.map((c) => (
            <th key={c.key} className="px-2 py-1.5 text-right font-semibold text-cesim-muted">
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SORTING_ROWS.map((row) => {
          const active = row.team === 'red'
          return (
            <tr key={row.team} className={cn('border-b border-gray-100', active && 'bg-cesim-link/5')}>
              <td className={cn('px-2 py-1.5 text-left', active ? 'font-bold text-cesim-ink' : 'text-cesim-muted')}>
                {teamName(row.team)}
                {active && <span className="ml-1 text-[10px] font-normal text-cesim-link">(you)</span>}
              </td>
              {SORTING_COLUMNS.map((c) => (
                <td
                  key={c.key}
                  className={cn('px-2 py-1.5 text-right tabular-nums', active ? 'font-semibold text-cesim-ink' : 'text-cesim-muted')}
                >
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
  const { resultsTab, setResultsTab } = useUI()

  return (
    <div>
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
                    className={cn(
                      'border-b-2 px-3 py-2 text-[12px] transition-colors',
                      active ? 'border-cesim-link font-semibold text-cesim-link' : 'border-transparent text-cesim-muted hover:text-cesim-ink',
                    )}
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
        <TabPanel title="Income statement">
          <TeamTable rows={INCOME} />
          <ChartPlaceholder label="Income and costs" />
        </TabPanel>
      )}

      {resultsTab === 'balance' && (
        <TabPanel title="Balance sheet">
          <TeamTable rows={BALANCE} />
          <ChartPlaceholder label="Assets, equity & liabilities" />
        </TabPanel>
      )}

      {resultsTab === 'market' && (
        <TabPanel title="Market report">
          <div className="mb-2 text-[12px] font-bold tracking-tight text-cesim-rule">Room rates</div>
          <TeamTable rows={MARKET.roomRates} />
          <div className="mb-2 mt-5 text-[12px] font-bold tracking-tight text-cesim-rule">Room sales and nights sold</div>
          <TeamTable rows={MARKET.salesAndNights} />
          <ChartPlaceholder label="Room sales & nights sold" />
        </TabPanel>
      )}

      {resultsTab === 'operations' && (
        <TabPanel title="Operations report">
          <TeamTable rows={OPERATIONS} />
          <ChartPlaceholder label="Quality level & personnel stress" />
        </TabPanel>
      )}

      {resultsTab === 'cashflow' && (
        <TabPanel title="Cash flow statement">
          <TeamTable rows={CASHFLOW} />
        </TabPanel>
      )}

      {resultsTab === 'ratios' && (
        <TabPanel title="Ratios — the scoreboard">
          <TeamTable rows={RATIOS} />
          <ChartPlaceholder label="Cumulative total shareholder return" />
        </TabPanel>
      )}

      {resultsTab === 'sorting' && (
        <TabPanel title="Sorting — league table">
          <SortingTable />
          <p className="mt-3 text-[11px] text-cesim-muted">
            The cross-team ranking. Competitor rows are shown for context; only Hotel Red is your team.
          </p>
        </TabPanel>
      )}

      <p className="mx-auto mt-3 max-w-[1180px] px-1 text-[11px] text-cesim-muted">
        Read-only. Figures are seeded from the last completed round ({LAST_ROUND.label}); all values in USD.
      </p>
    </div>
  )
}
