import { useState } from 'react'
import { cn } from '../../lib/cn'
import { FIELDS } from '../../data/fields'
import { fieldTips } from '../../data/fieldTips'
import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { InfoIcon } from './InfoIcon'
import { Tag } from './Tag'

// One editable decision: label + ⓘ on the left, an editable input with its unit on the
// right. Units go ON the field (spec §7). Estimation cells are marked. When the field is
// focused, a short GREEN business-principle "field tip" appears beneath it — in-context
// micro-coaching at the moment of interaction, rotating via ↻ (see fieldTips.js).

// Enter commits and moves to the next decision input on the page — nudging the user
// through the fields in sequence. Falls back to blurring on the last field.
function advanceOnEnter(e) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  const inputs = Array.from(document.querySelectorAll('input[data-decision-input]:not([disabled])'))
  const next = inputs[inputs.indexOf(e.currentTarget) + 1]
  if (next) next.focus()
  else e.currentTarget.blur()
}

function UnitInput({ field, value, onChange, disabled, onFocus, onBlur }) {
  const prefix = field.unit === '$' ? '$' : null
  const suffix = field.unit && field.unit !== '$' ? field.unit : null
  return (
    <div
      className={cn(
        'flex w-36 shrink-0 items-center gap-1 rounded border bg-surface-input px-1.5 py-0.5',
        disabled ? 'border-gray-200' : 'border-cesim-link/40 focus-within:ring-1 focus-within:ring-cesim-link',
      )}
    >
      {prefix && <span className="text-[12px] text-cesim-muted">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        data-decision-input=""
        disabled={disabled}
        value={value ?? ''}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.default === '' ? '—' : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={advanceOnEnter}
        className="min-w-0 flex-1 bg-transparent text-right text-[13px] tabular-nums outline-none disabled:cursor-not-allowed"
      />
      {suffix && <span className="whitespace-nowrap text-[11px] text-cesim-muted">{suffix}</span>}
    </div>
  )
}

export function DecisionField({ fieldId, highlight }) {
  const field = FIELDS[fieldId]
  const { values, setValue, markTouched, touched } = useDecisions()
  const { openField, explain } = useUI()
  const value = values[fieldId]
  const made = touched.has(fieldId)

  const tips = fieldTips[fieldId]
  const [focused, setFocused] = useState(false)
  // Random starting tip so different fields/visits don't all open on tip #1.
  const [tipIdx, setTipIdx] = useState(() => Math.floor(Math.random() * 100))

  const commit = (raw) => {
    if (raw === '') return setValue(fieldId, '')
    let n = parseFloat(raw)
    if (!Number.isFinite(n)) return
    // Clamp to declared bounds (the "why" lives in the modal; this just enforces it).
    if (typeof field.min === 'number') n = Math.max(field.min, n)
    if (typeof field.max === 'number') n = Math.min(field.max, n)
    setValue(fieldId, n)
  }

  const showTip = focused && !field.ghosted && tips?.length > 0

  return (
    <div>
      <div
        className={cn(
          'flex items-start justify-between gap-3 rounded px-1 py-1',
          highlight && 'bg-yellow-50 ring-1 ring-yellow-300',
          field.ghosted && 'ghosted',
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {!field.ghosted && (
            <span
              title={made ? 'Decision made' : 'Not yet entered'}
              className={cn(
                'mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold leading-none transition-colors',
                made ? 'bg-emerald-500 text-white' : 'border border-gray-300 bg-white text-transparent',
              )}
            >
              ✓
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-y-0.5 text-[13px]">
            <button
              type="button"
              onClick={() => openField(fieldId)}
              className="text-left leading-snug text-cesim-ink hover:text-cesim-link hover:underline"
              title="Open the decision detail"
            >
              {field.label}
            </button>
            {field.kind === 'estimation' && (
              <span className="ml-1.5" title="Forecast — feeds the budget only, does not change your actual results">
                <Tag variant="estimation">forecast</Tag>
              </span>
            )}
            <InfoIcon help={field.help} label={field.label} onOpen={() => explain(fieldId)} />
          </div>
        </div>
        <UnitInput
          field={field}
          value={value}
          onChange={commit}
          disabled={field.ghosted}
          onFocus={() => {
            setFocused(true)
            markTouched(fieldId)
          }}
          onBlur={() => setFocused(false)}
        />
      </div>

      {showTip && (
        <div className="mx-1 mb-1 mt-0.5 flex items-start gap-1.5 rounded border-l-2 border-green-500 bg-green-50 px-2 py-1 text-[11px] leading-snug text-green-900">
          <span aria-hidden className="select-none">🏛️</span>
          <span className="flex-1">{tips[tipIdx % tips.length]}</span>
          {tips.length > 1 && (
            <button
              type="button"
              // Keep the input focused so the tip doesn't vanish when cycling.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setTipIdx((i) => i + 1)}
              title="Another tip"
              className="shrink-0 rounded px-1 text-green-700 hover:bg-green-100"
            >
              ↻
            </button>
          )}
        </div>
      )}
    </div>
  )
}
