import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { FIELDS, DECISION_ORDER } from '../../data/fields'
import { Tooltip } from '../shared/Tooltip'
import { cn } from '../../lib/cn'

// THE DECISION-LOOP STRIP (spec §6) — the "sequence" overlay. Sits below the native top
// bar and steps through the decisions in dependency order: Sales → Operations → Finance.
// Each step shows its number, which flips to a green check once that step's decisions are
// all filled. A progress counter + bar tracks the whole set; it loops.

const PHASES = [
  { id: 'sales', label: 'Sales', hint: 'demand · price · marketing' },
  { id: 'operations', label: 'Operations', hint: 'staff & maintenance to that demand' },
  { id: 'finance', label: 'Finance', hint: 'loans · dividends · credit term' },
]

export function DecisionLoopStrip({ page, onNavigate }) {
  const { touched, progress } = useDecisions()
  const { setProjectionsOpen } = useUI()

  // Per-step completion, computed from decisions the user has actually made (touched).
  const steps = PHASES.map((ph, i) => {
    const ids = DECISION_ORDER.filter((id) => FIELDS[id].page === ph.id && !FIELDS[id].ghosted)
    const made = ids.filter((id) => touched.has(id)).length
    return { ...ph, n: i + 1, made, total: ids.length, done: ids.length > 0 && made === ids.length }
  })

  const idx = PHASES.findIndex((p) => p.id === page)
  const pct = Math.round((progress.made / progress.total) * 100)

  const goPrev = () => idx > 0 && onNavigate(PHASES[idx - 1].id)
  const goNext = () => {
    if (idx < 0) return onNavigate(PHASES[0].id) // jump into the sequence
    if (idx < PHASES.length - 1) return onNavigate(PHASES[idx + 1].id)
    setProjectionsOpen(true) // end of Finance → review budgets
  }

  return (
    <div className="border-b border-header-active/30 bg-header-active text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
          Your decisions
        </span>

        {/* The decision stepper: Sales → Operations → Finance */}
        <div className="flex items-center gap-1">
          {steps.map((ph, i) => {
            const active = ph.id === page
            return (
              <div key={ph.id} className="flex items-center">
                <Tooltip content={`${ph.hint} — ${ph.made}/${ph.total} made`} width={220}>
                  <button
                    type="button"
                    onClick={() => onNavigate(ph.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] transition-colors',
                      active ? 'bg-white font-bold text-header-active' : 'text-white/85 hover:bg-white/10',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold leading-none',
                        ph.done
                          ? 'bg-emerald-500 text-white'
                          : active
                            ? 'bg-header-active text-white'
                            : 'bg-white/25 text-white',
                      )}
                    >
                      {ph.done ? '✓' : ph.n}
                    </span>
                    {ph.label}
                  </button>
                </Tooltip>
                {i < steps.length - 1 && <span className="px-0.5 text-white/40">→</span>}
              </div>
            )
          })}
        </div>

        {/* Prev / Next — free navigation, not a locked wizard */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={idx <= 0}
            className="rounded px-2 py-1 text-[12px] text-white/85 hover:bg-white/10 disabled:opacity-30"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded bg-white/15 px-2.5 py-1 text-[12px] font-semibold hover:bg-white/25"
          >
            {idx === PHASES.length - 1 ? 'Review budgets ⤢' : 'Next ›'}
          </button>
        </div>

        {/* Progress counter + bar */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] tabular-nums text-white/90">
            {progress.made} of {progress.total} decisions made
          </span>
          <div className="h-1.5 w-24 overflow-hidden rounded bg-white/20">
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Loop + inactive inter-round gesture */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('sales')}
            className="rounded px-2 py-1 text-[12px] text-white/85 hover:bg-white/10"
            title="Repeat the season — restart the decision loop"
          >
            ↻ Repeat season
          </button>
          <Tooltip
            width={230}
            content="Inter-round progression is out of scope in v1 — every round is mechanically identical; only the season label changes."
          >
            <span className="cursor-not-allowed rounded border border-white/20 px-2 py-1 text-[12px] text-white/40">
              Advance to next season →
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
