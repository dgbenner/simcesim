import { cn } from '../../lib/cn'

// Unified tag/badge system. Only two status pills are used in the app, and the colors
// mean the same thing everywhere:
//   decision   — an editable lever you set            (blue)
//   estimation — a forecast: feeds the budget only    (amber)
// Units are shown inline on fields ($, %, nights…) — they are not tagged.
const VARIANTS = {
  decision: 'bg-cesim-link/10 text-cesim-link',
  estimation: 'bg-amber-100 text-amber-700',
}

export function Tag({ variant = 'decision', children, className }) {
  return (
    <span
      className={cn(
        'inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
