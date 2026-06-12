import { Fragment } from 'react'
import { useDecisions } from '../../state/decisions'
import { PageHeader } from '../shared/PageHeader'
import { FIELDS, DECISION_ORDER, PAGES } from '../../data/fields'
import { HOTEL_RED, displayName } from '../../data/team'
import { RoundSelector } from '../chrome/RoundSelector'
import { cn } from '../../lib/cn'
import { usd, int, pct, dec2 } from '../../lib/format'

// DECISION CHECKLIST (spec §5): the team decision grid. Round selector top-LEFT. Only
// Hotel Red is active among teams; Sarah Wall's column is ghosted (she's the instructor,
// mistakenly on the roster). The current user (Dan Benner) column carries the live values.

function fmtValue(field, v) {
  if (v === '' || v === null || v === undefined) return '—'
  switch (field.unit) {
    case '$':
    case '$/month':
    case '$/person':
      return usd(v)
    case '%':
      return pct(v)
    case 'nights':
      return `${int(v)}`
    case '# people':
      return dec2(v)
    case 'days':
      return `${int(v)}`
    case 'rooms':
      return `${int(v)}`
    default:
      return String(v)
  }
}

export function DecisionChecklistPage() {
  const { values } = useDecisions()

  // Columns: the team aggregate + each member. Dan Benner is "you" (live values).
  const columns = [
    { key: 'team', name: 'Hotel Red', team: true },
    ...HOTEL_RED.members.map((m) => ({
      key: m.name,
      name: displayName(m.name), // Hotel Red → full name; the rule anonymizes everyone else
      you: m.name === 'Dan Benner',
    })),
  ]

  // Group decisions by page in dependency order.
  const groups = ['sales', 'operations', 'finance'].map((page) => ({
    page,
    label: PAGES[page],
    ids: DECISION_ORDER.filter((id) => FIELDS[id].page === page),
  }))

  const cellValue = (col, field) => {
    if (col.you || col.team) return fmtValue(field, values[field.id])
    return '—' // other members: no separate data in v1
  }

  return (
    <div>
      <PageHeader
        title="Decision Checklist"
        subtitle="Every decision across the team in one grid. Your column drives the live figures."
      />
      {/* Round selector is top-LEFT on the checklist (top-right is for Results — spec §5) */}
      <div className="mb-3">
        <RoundSelector />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-surface-tablehead">
              <th className="px-3 py-2 text-left font-semibold text-cesim-muted">Decision</th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    'px-3 py-2 text-right font-semibold',
                    c.you ? 'text-cesim-link' : 'text-cesim-muted',
                  )}
                >
                  {c.name}
                  {c.you && <span className="ml-1 text-[10px] font-normal">(you)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.page}>
                <tr className="bg-gray-50">
                  <td
                    colSpan={columns.length + 1}
                    className="border-y border-gray-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cesim-rule"
                  >
                    {g.label}
                  </td>
                </tr>
                {g.ids.map((id) => {
                  const field = FIELDS[id]
                  return (
                    <tr key={id} className="border-b border-gray-100">
                      <td className={cn('px-3 py-[5px] text-left text-cesim-ink', field.ghosted && 'opacity-40')}>
                        {field.label}
                        {field.unit && <span className="ml-1 text-[10px] text-cesim-muted">({field.unit})</span>}
                      </td>
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={cn(
                            'px-3 py-[5px] text-right tabular-nums',
                            c.you ? 'bg-cesim-link/5 font-semibold text-cesim-ink' : 'text-cesim-muted',
                          )}
                        >
                          {cellValue(c, field)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-cesim-muted">
        In v1, your decisions (Dan Benner) drive the live figures — per-member columns are
        part of v2's multi-user scope.
      </p>
    </div>
  )
}
