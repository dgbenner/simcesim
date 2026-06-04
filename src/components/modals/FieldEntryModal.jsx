import { Modal } from '../shared/Modal'
import { FIELDS } from '../../data/fields'
import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { cn } from '../../lib/cn'

// The teaching moment (spec §9): the input with its unit, the bounds AND why they exist,
// and the directional cause-and-effect. Editing here writes straight to the store.

const DIR = {
  '+': { glyph: '▲', cls: 'text-emerald-600', word: 'up' },
  '-': { glyph: '▼', cls: 'text-rose-600', word: 'down' },
  '~': { glyph: '~', cls: 'text-cesim-muted', word: 'shifts' },
}

export function FieldEntryModal() {
  const { modalField, closeField } = useUI()
  const { values, setValue } = useDecisions()
  const field = modalField ? FIELDS[modalField] : null

  const commit = (raw) => {
    if (raw === '') return setValue(field.id, '')
    let n = parseFloat(raw)
    if (!Number.isFinite(n)) return
    if (typeof field.min === 'number') n = Math.max(field.min, n)
    if (typeof field.max === 'number') n = Math.min(field.max, n)
    setValue(field.id, n)
  }

  if (!field) return null
  const value = values[field.id]
  const prefix = field.unit === '$' ? '$' : null
  const suffix = field.unit && field.unit !== '$' ? field.unit : null

  return (
    <Modal
      open={!!field}
      onClose={closeField}
      title={field.label}
      subtitle={field.kind === 'estimation' ? 'Estimation cell — feeds the budget only, not actual results' : 'Decision'}
      width="max-w-md"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeField}
            className="rounded bg-cesim-link px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-header-bottom"
          >
            Done
          </button>
        </div>
      }
    >
      {/* 1. The input, unit shown */}
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-cesim-muted">
        Your entry
      </label>
      <div
        className={cn(
          'mb-4 flex items-center gap-1 rounded border px-2 py-1.5',
          field.ghosted ? 'border-gray-200 bg-gray-50' : 'border-cesim-link/50 bg-surface-input focus-within:ring-1 focus-within:ring-cesim-link',
        )}
      >
        {prefix && <span className="text-cesim-muted">{prefix}</span>}
        <input
          type="number"
          autoFocus
          disabled={field.ghosted}
          value={value ?? ''}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => commit(e.target.value)}
          className="w-full bg-transparent text-[15px] tabular-nums outline-none disabled:cursor-not-allowed"
        />
        {suffix && <span className="whitespace-nowrap text-[12px] text-cesim-muted">{suffix}</span>}
      </div>

      {/* 2. Bounds AND why */}
      <div className="mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">
          The bounds — and why
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-cesim-ink">{field.boundsWhy}</p>
      </div>

      {/* 3. Cause and effect */}
      {field.effects?.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">
            If you raise this…
          </div>
          <ul className="mt-1.5 space-y-1.5">
            {field.effects.map((e, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-cesim-ink">
                <span className={cn('font-bold', DIR[e.dir].cls)}>{DIR[e.dir].glyph}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  )
}
