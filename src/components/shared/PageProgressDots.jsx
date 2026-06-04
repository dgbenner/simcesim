import { useDecisions } from '../../state/decisions'
import { FIELDS, DECISION_ORDER } from '../../data/fields'
import { cn } from '../../lib/cn'

// A light, sequenced progress indicator for a single page's decisions (sits top-right,
// opposite the H1). One dot per editable field, in order; a dot fills once the user has
// engaged that field. Quieter in weight + type than the top strip — it's the on-page
// companion to the strip's accumulated total.
export function PageProgressDots({ page }) {
  const { made: madeSet } = useDecisions()
  const ids = DECISION_ORDER.filter((id) => FIELDS[id].page === page && !FIELDS[id].ghosted)
  if (ids.length === 0) return null
  const made = ids.filter((id) => madeSet.has(id)).length

  return (
    <div className="hidden select-none flex-col items-end gap-1 sm:flex">
      <span className="text-[11px] font-light tracking-wide text-cesim-muted">
        {made} of {ids.length} decisions entered
      </span>
      <div className="flex gap-1">
        {ids.map((id) => (
          <span
            key={id}
            title={`${FIELDS[id].label}${madeSet.has(id) ? ' — entered' : ' — not yet'}`}
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              madeSet.has(id) ? 'bg-emerald-400' : 'border border-gray-300',
            )}
          />
        ))}
      </div>
    </div>
  )
}
