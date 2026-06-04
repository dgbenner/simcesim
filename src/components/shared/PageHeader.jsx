// Strong, consistent page header: bold title with a tight italic subtitle beneath it
// (kept narrow so it wraps nicely), then a red rule that acts as the break between the
// header unit and the page content. `right` holds an optional element (e.g. the page's
// progress dots) aligned with the title.
export function PageHeader({ title, subtitle, right }) {
  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-cesim-ink">{title}</h1>
        {right && <div className="shrink-0 pt-1">{right}</div>}
      </div>
      {subtitle && (
        <p className="mt-1 max-w-[60%] text-[12px] italic leading-snug text-cesim-muted">{subtitle}</p>
      )}
      <div className="mt-2.5 h-[2px] w-full rounded-full bg-brand-red/80" />
    </div>
  )
}
