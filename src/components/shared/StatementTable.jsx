import { cn } from '../../lib/cn'
import { Gloss } from './AcronymTooltip'
import { InfoIcon } from './InfoIcon'

// Read-only statement/readout table with a pale-blue header (spec §12). Columns are
// right-aligned numbers; the first column is the row label. Row labels and headers may
// carry a glossary term (`gloss`) so jargon underlines, or an info `help`.
//
// columns: [{ key, label, gloss? }]
// rows:    [{ label, gloss?, help?, values: {colKey: string}, bold?, indent?, rule? }]

function Cell({ children, header, bold }) {
  return (
    <td
      className={cn(
        'px-2 py-[3px] text-right tabular-nums',
        header ? 'font-semibold text-cesim-muted' : 'text-cesim-ink',
        bold && 'font-bold',
      )}
    >
      {children}
    </td>
  )
}

export function StatementTable({ columns, rows }) {
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-surface-tablehead">
          <th className="px-2 py-1 text-left font-semibold text-cesim-muted" />
          {columns.map((c) => (
            <th key={c.key} className="px-2 py-1 text-right font-semibold text-cesim-muted">
              {c.gloss ? <Gloss term={c.gloss}>{c.label}</Gloss> : c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.label + i}
            className={cn('border-b border-gray-100', row.rule && 'border-t border-gray-300')}
          >
            <td className={cn('px-2 py-[3px] text-left', row.bold ? 'font-bold text-cesim-ink' : 'text-cesim-ink', row.indent && 'pl-5 text-cesim-muted')}>
              {row.gloss ? <Gloss term={row.gloss}>{row.label}</Gloss> : row.label}
              {row.help && <InfoIcon help={row.help} label={row.label} />}
            </td>
            {columns.map((c) => (
              <Cell key={c.key} bold={row.bold}>
                {row.values?.[c.key] ?? ''}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
