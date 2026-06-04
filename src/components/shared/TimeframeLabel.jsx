import { cn } from '../../lib/cn'

// A small uppercase timeframe marker placed directly above a group of time-bound
// decisions (e.g. "THIS SEASON (SUMMER)", "NEXT SEASON (WINTER)"). The pattern: wherever
// decisions have a set timeframe, head them with this so the window is unmistakable.
export function TimeframeLabel({ children, className }) {
  return (
    <div className={cn('text-[11px] font-bold uppercase tracking-wide text-cesim-muted', className)}>
      {children}
    </div>
  )
}
