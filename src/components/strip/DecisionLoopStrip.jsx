import { useDecisions } from '../../state/decisions'
import { useUI } from '../../state/ui'
import { FIELDS, DECISION_ORDER } from '../../data/fields'
import { Tooltip } from '../shared/Tooltip'
import { RoundSelector } from '../chrome/RoundSelector'
import { cn } from '../../lib/cn'

// THE DECISION-LOOP STRIP (spec §6) — the "sequence" overlay. Sits below the native top
// bar and steps through the decisions in dependency order: Sales → Operations → Finance.
// Each step's number flips to a green check once that step's decisions are all made. A
// progress counter + bar tracks the whole set; it loops.

const PHASES = [
  { id: 'sales', label: 'Sales' },
  { id: 'operations', label: 'Operations' },
  { id: 'finance', label: 'Finance' },
]

// Concise names for the per-step tooltip checklist (the full field labels are too long).
const SHORT = {
  walkInRate: 'Walk-in room rate',
  estNightsSold: 'Estimated nights sold',
  advanceNextSeason: 'Advance — next season',
  advanceTwoSeasons: 'Advance — two seasons ahead',
  marketing: 'Marketing',
  maintenance: 'Maintenance & renovation',
  directCostSaving: 'Direct cost saving',
  adminCostSaving: 'Admin cost saving',
  turnover: 'Personnel turnover',
  headcount: 'Personnel this period',
  wage: 'Wage / month',
  training: 'Training budget',
  ltLoanChange: 'Long-term loans',
  dividends: 'Dividends paid',
  creditTerm: 'Credit term',
}

export function DecisionLoopStrip({ page, onNavigate }) {
  const { made: madeSet, progress, season, readOnly } = useDecisions()
  const { setProjectionsOpen } = useUI()

  // Per-step completion, computed from decisions the user has actually made.
  const steps = PHASES.map((ph, i) => {
    const ids = DECISION_ORDER.filter((id) => FIELDS[id].page === ph.id && !FIELDS[id].ghosted)
    const made = ids.filter((id) => madeSet.has(id)).length
    return { ...ph, n: i + 1, ids, made, total: ids.length, done: ids.length > 0 && made === ids.length }
  })

  const idx = PHASES.findIndex((p) => p.id === page)
  const pct = Math.round((progress.made / progress.total) * 100)

  const goPrev = () => idx > 0 && onNavigate(PHASES[idx - 1].id)
  const goNext = () => {
    if (idx < 0) return onNavigate(PHASES[0].id) // jump into the sequence
    if (idx < PHASES.length - 1) return onNavigate(PHASES[idx + 1].id)
    setProjectionsOpen(true) // end of Finance → review budgets
  }

  // A clean, formatted tooltip: heading + count, then a checklist of this step's decisions.
  const phaseTip = (ph) => (
    <div className="text-left">
      <div className="font-bold text-white">Decisions in {ph.label}</div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
        {ph.made} of {ph.total} made
      </div>
      <ul className="space-y-0.5">
        {ph.ids.map((id) => {
          const done = madeSet.has(id)
          return (
            <li key={id} className="flex items-center gap-1.5">
              <span className={done ? 'text-emerald-400' : 'text-white/40'}>{done ? '✓' : '○'}</span>
              <span className={done ? 'text-white' : 'text-white/70'}>{SHORT[id] ?? FIELDS[id].label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div className="border-b border-header-active/30 bg-header-active text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
          Your decisions
        </span>

        {/* The decision stepper: Sales → Operations → Finance */}
        <div className="flex items-center">
          {steps.map((ph, i) => {
            const active = ph.id === page
            return (
              <div key={ph.id} className="flex items-center">
                <Tooltip content={phaseTip(ph)} width={210} placement="bottom">
                  <button
                    type="button"
                    onClick={() => onNavigate(ph.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded px-2 py-1 text-[12px] transition-colors',
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
                {i < steps.length - 1 && <span className="text-white/40">→</span>}
              </div>
            )
          })}
        </div>

        {/* Prev / Next — free navigation, not a locked wizard */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={goPrev}
            disabled={idx <= 0}
            className="rounded px-1.5 py-1 text-[12px] text-white/85 hover:bg-white/10 disabled:opacity-30"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded bg-white/15 px-2 py-1 text-[12px] font-semibold hover:bg-white/25"
          >
            {idx === PHASES.length - 1 ? 'Review budgets ⤢' : 'Next ›'}
          </button>
        </div>

        {/* Progress counter + bar */}
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-[12px] tabular-nums text-white/90">
            {progress.made} of {progress.total} made
          </span>
          <div className="h-1.5 w-20 overflow-hidden rounded bg-white/20">
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Loop + round navigation (review past rounds / return to the live one) */}
        <div className="ml-auto flex items-center gap-1.5">
          {!readOnly && (
            <button
              type="button"
              onClick={() => onNavigate('sales')}
              className="whitespace-nowrap rounded px-1.5 py-1 text-[12px] text-white/85 hover:bg-white/10"
              title={`Start this ${season}'s decisions over from the top`}
            >
              ↻ Start over
            </button>
          )}
          <RoundSelector tone="dark" />
        </div>
      </div>
    </div>
  )
}
