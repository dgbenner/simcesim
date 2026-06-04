import { useEffect, useState } from 'react'
import { FIELDS } from '../../data/fields'
import { useUI } from '../../state/ui'
import { Tag } from '../shared/Tag'
import { cn } from '../../lib/cn'

// The dynamic, per-field teaching surface (spec §8 "meaning"). Clicking a field's ⓘ slides
// this in from the right over the workspace — NO scrim, NO darkening; the rest of the page
// stays visible and usable. Distinct from the persistent HowToReadPanel legend.

const DIR = {
  '+': { glyph: '▲', cls: 'text-emerald-600' },
  '-': { glyph: '▼', cls: 'text-rose-600' },
  '~': { glyph: '~', cls: 'text-cesim-muted' },
}

function rangeText(f) {
  const fmt = (v) => (f.unit === '$' ? `$${Number(v).toLocaleString()}` : `${v} ${f.unit || ''}`.trim())
  if (typeof f.min === 'number' && typeof f.max === 'number') return `${fmt(f.min)} – ${fmt(f.max)}`
  if (typeof f.max === 'number') return `up to ${fmt(f.max)}`
  return '—'
}

export function ExplainDrawer() {
  const { explainField, explain } = useUI()
  const open = !!explainField

  // Keep the last field mounted through the close animation so the panel doesn't blank
  // mid-slide. Syncing on open is intentional; clearing is deferred until the slide ends.
  const [shown, setShown] = useState(explainField)
  useEffect(() => {
    if (explainField) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror open state for the slide-in
      setShown(explainField)
      return
    }
    const t = setTimeout(() => setShown(null), 220)
    return () => clearTimeout(t)
  }, [explainField])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && explain(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, explain])

  const field = shown ? FIELDS[shown] : null

  return (
    <div
      role="complementary"
      aria-hidden={!open}
      className={cn(
        'fixed right-0 top-0 z-40 flex h-full w-[370px] max-w-[88vw] flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-200 ease-out',
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
      )}
    >
      {field && (
        <>
          <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gray-50/70 px-5 py-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-cesim-muted">
                Field detail
              </div>
              <h3 className="text-[16px] font-bold text-cesim-ink">{field.label}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Tag variant={field.kind === 'estimation' ? 'estimation' : 'decision'}>
                  {field.kind === 'estimation' ? 'forecast' : 'decision'}
                </Tag>
                {field.unit && (
                  <span className="text-[11px] text-cesim-muted">
                    measured in <span className="font-semibold text-cesim-ink">{field.unit}</span>
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => explain(null)}
              aria-label="Close"
              className="-mr-1 text-xl leading-none text-cesim-muted hover:text-cesim-ink"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-auto px-5 py-4">
            <p className="text-[13px] leading-relaxed text-cesim-ink">{field.help}</p>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">Range</div>
              <div className="mt-0.5 text-[13px] font-semibold text-cesim-ink">{rangeText(field)}</div>
              <p className="mt-1 text-[12px] leading-relaxed text-cesim-muted">{field.boundsWhy}</p>
            </div>

            {field.effects?.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-cesim-muted">
                  If you change this…
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
          </div>
        </>
      )}
    </div>
  )
}
