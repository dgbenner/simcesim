import { useId, useState } from 'react'
import { cn } from '../../lib/cn'

// Lightweight hover/focus tooltip. Keyboard-accessible (focusable trigger + Escape).
// `content` is rendered in a small dark popover; `placement` is 'top' (default) or
// 'bottom' — use 'bottom' for triggers near the top of the page (e.g. the strip) so the
// popover drops down instead of clipping off-screen.
export function Tooltip({ children, content, className, width = 260, placement = 'top' }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  if (!content) return children

  const below = placement === 'bottom'

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open && (
        <span
          id={id}
          role="tooltip"
          style={{ width }}
          className={cn(
            'absolute left-1/2 z-40 -translate-x-1/2 rounded bg-cesim-ink px-2.5 py-2 text-left text-[12px] font-normal leading-snug text-white shadow-lg',
            below ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
          )}
        >
          {content}
          <span
            className={cn(
              'absolute left-1/2 -translate-x-1/2 border-4 border-transparent',
              below ? 'bottom-full border-b-cesim-ink' : 'top-full border-t-cesim-ink',
            )}
          />
        </span>
      )}
    </span>
  )
}
