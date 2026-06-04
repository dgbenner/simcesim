import { cn } from '../../lib/cn'

// White panel with a blue section title + underline rule (spec §12).
export function Section({ title, children, className, right }) {
  return (
    <section className={cn('card p-4', className)}>
      {title && (
        <div className="mb-3 flex items-center justify-between border-b-2 border-cesim-rule pb-1">
          <h2 className="text-[15px] font-bold tracking-tight text-cesim-rule">{title}</h2>
          {right}
        </div>
      )}
      {children}
    </section>
  )
}
