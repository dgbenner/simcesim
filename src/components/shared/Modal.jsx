import { useEffect } from 'react'
import { cn } from '../../lib/cn'

// Lightbox modal: dim scrim, click-outside + Escape to close, X top-right (spec §10/§12).
export function Modal({ open, onClose, title, subtitle, children, footer, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('card max-h-[90vh] w-full overflow-auto', width)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-surface-card px-5 py-3">
          <div>
            <h2 className="text-[16px] font-semibold text-cesim-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-cesim-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 text-xl leading-none text-cesim-muted hover:text-cesim-ink"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="border-t border-gray-200 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}
