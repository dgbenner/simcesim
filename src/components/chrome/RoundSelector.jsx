import { useState } from 'react'
import { ROUNDS } from '../../data/team'
import { CURRENT_ROUND } from '../../data/config'
import { useUI } from '../../state/ui'
import { cn } from '../../lib/cn'

// Round selector — navigate the Decisions section across rounds. The current round
// (config.CURRENT_ROUND) is editable; completed rounds open review-only (their actual
// decisions, locked); future rounds are unavailable. Drives `decisionRound` in UI state.
export function RoundSelector({ tone = 'light' }) {
  const { decisionRound, setDecisionRound } = useUI()
  const [open, setOpen] = useState(false)
  const current = ROUNDS.find((r) => r.n === decisionRound)
  const reviewing = decisionRound !== CURRENT_ROUND
  const dark = tone === 'dark'

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 whitespace-nowrap rounded font-semibold',
          dark
            ? cn('px-2 py-1 text-[12px]', reviewing ? 'bg-amber-300 text-amber-950' : 'bg-white/15 text-white hover:bg-white/25')
            : cn('border px-3 py-1.5 text-[13px]', reviewing ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-300 bg-white text-cesim-ink hover:border-cesim-link'),
        )}
        title="Switch round — past rounds open review-only"
      >
        {reviewing && <span aria-hidden>🔒</span>}
        Round {current.n} · {current.season}
        <span className={dark ? 'text-white/70' : 'text-cesim-muted'}>▾</span>
      </button>
      {open && (
        <ul className="absolute right-0 z-30 mt-1 w-48 rounded border border-gray-200 bg-white py-1 shadow-lg">
          {ROUNDS.map((r) => {
            const selectable = r.state === 'past' || r.state === 'current'
            const isCurrent = r.n === decisionRound
            return (
              <li key={r.n}>
                <button
                  type="button"
                  disabled={!selectable}
                  onClick={() => { setDecisionRound(r.n); setOpen(false) }}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px]',
                    isCurrent && 'bg-cesim-link/10 font-semibold text-cesim-link',
                    !isCurrent && selectable && 'text-cesim-ink hover:bg-gray-50',
                    !selectable && 'cursor-default text-cesim-muted opacity-50',
                  )}
                >
                  <span>Round {r.n} · {r.season}</span>
                  <span className="text-[10px] text-cesim-muted">
                    {r.state === 'current' ? 'editable' : r.state === 'past' ? 'review' : 'locked'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
