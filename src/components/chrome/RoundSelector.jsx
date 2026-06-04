import { useState } from 'react'
import { ROUNDS, CURRENT_ROUND } from '../../data/team'
import { cn } from '../../lib/cn'

// Round selector (spec §5): all 7 real rounds, season-labeled; only the current round
// (Round 2 · Summer) is active. Past/future shown but inactive — v1 has no multi-round
// state, every round is mechanically identical. Top-LEFT on the Decision checklist.
export function RoundSelector() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-[13px] font-semibold text-cesim-ink hover:border-cesim-link"
      >
        Round {CURRENT_ROUND.n} · {CURRENT_ROUND.season}
        <span className="text-cesim-muted">▾</span>
      </button>
      {open && (
        <ul className="absolute left-0 z-30 mt-1 w-44 rounded border border-gray-200 bg-white py-1 shadow-lg">
          {ROUNDS.map((r) => {
            const active = r.state === 'current'
            return (
              <li key={r.n}>
                <button
                  type="button"
                  disabled={!active}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px]',
                    active ? 'bg-cesim-link/10 font-semibold text-cesim-link' : 'cursor-default text-cesim-muted opacity-50',
                  )}
                >
                  <span>Round {r.n} · {r.season}</span>
                  {r.state === 'past' && <span className="text-[10px]">past</span>}
                  {r.state === 'future' && <span className="text-[10px]">locked</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
