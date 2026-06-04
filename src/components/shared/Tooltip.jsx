import { useId, useState } from 'react'
import { cn } from '../../lib/cn'

// Lightweight hover/focus tooltip. Keyboard-accessible (focusable trigger + Escape).
// `content` is rendered inside a small dark popover above the trigger.
export function Tooltip({ children, content, className, width = 260 }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  if (!content) return children

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
          className="absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded bg-cesim-ink px-2.5 py-2 text-left text-[12px] font-normal leading-snug text-white shadow-lg"
        >
          {content}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-cesim-ink" />
        </span>
      )}
    </span>
  )
}
