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
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5">
        <span className="flex items-center gap-2 text-[12px]">
          <span aria-hidden>🏁</span>
          <span className="font-semibold">Mini MBA June 2026</span>
          <span className="text-white/70">·</span>
          <span className="text-white/90">7 Rounds Complete</span>
          <span className="hidden text-white/50 sm:inline">·</span>
          <span className="hidden text-white/60 sm:inline">Jun 2–23</span>
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={goToFinal}
            className={cn(
              'rounded px-2.5 py-1 text-[12px] font-semibold transition-colors',
              active ? 'bg-white text-purple-800' : 'bg-white/15 text-white hover:bg-white/25',
            )}
          >
            Final Results →
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 rounded bg-white/15 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-white/25"
            >
              ⤓ Download results <span className="text-white/70">▾</span>
            </button>
            {open && (
              <ul className="absolute right-0 z-40 mt-1 w-52 rounded border border-gray-200 bg-white py-1 text-cesim-ink shadow-lg">
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
          </div>
        </div>
      </div>
    </div>
  )
}
