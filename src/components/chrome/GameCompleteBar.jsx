import { useState } from 'react'
import { useUI } from '../../state/ui'
import { FINAL_DOWNLOADS } from '../../data/finalResults'
import { seasonOfRound } from '../../data/config'
import { cn } from '../../lib/cn'

// The PURPLE "game complete" bar across the very top of the system (final-results addendum),
// distinct from the blue Cesim chrome. Marks the 7-round game done; links to the Final
// Results review page and offers the raw round-result spreadsheets for download.
export function GameCompleteBar() {
  const { section, goToFinal } = useUI()
  const [open, setOpen] = useState(false)
  const active = section === 'final'
  const label = (n) => `Round ${n} · ${seasonOfRound(n) === 'winter' ? 'Winter' : 'Summer'}`

  return (
    <div className="bg-purple-800 text-white">
      <div className="relative mx-auto flex max-w-[1180px] items-center px-4 py-1.5">
        {/* Left: label + a small underlined Download-results link (opens the per-round menu) */}
        <span className="flex items-center gap-2 text-[12px]">
          <span aria-hidden>🏁</span>
          <span className="font-semibold">Mini MBA June 2026</span>
          <span className="text-white/70">·</span>
          <span className="text-white/90">7 Rounds Complete</span>
          <span className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-[11px] text-white/75 underline underline-offset-2 hover:text-white"
            >
              Download results
            </button>
            {open && (
              <ul className="absolute left-0 z-40 mt-1 w-52 rounded border border-gray-200 bg-white py-1 text-cesim-ink shadow-lg">
                {FINAL_DOWNLOADS.map((d) => (
                  <li key={d.round}>
                    <a
                      href={d.href}
                      download
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-1.5 text-[12px] hover:bg-gray-50"
                    >
                      <span>{label(d.round)}</span>
                      <span className="text-[10px] text-cesim-muted">.xls</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </span>
          <span className="hidden text-white/50 md:inline">·</span>
          <span className="hidden text-white/60 md:inline">Jun 2–23</span>
        </span>

        {/* Center: the Final Results link, given prominence */}
        <button
          type="button"
          onClick={goToFinal}
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-3.5 py-1 text-[12px] font-bold shadow-sm transition-colors',
            active ? 'bg-white text-purple-800 ring-2 ring-white/60' : 'bg-white text-purple-800 hover:bg-white/90',
          )}
        >
          Final Results →
        </button>
      </div>
    </div>
  )
}
