import { cn } from '../../lib/cn'
import { DOCS } from '../../data/docs'
import { DECISION_PAGES } from '../../data/nav'

// The Decisions sub-nav — the spine for the decision pages. Active item gets a blue
// label + underline (matches the live tool). The right cluster carries the one-pager +
// source docs and the Projections lightbox. (Round navigation lives on the strip above.)
export function SubNav({ page, onNavigate, onOpenProjections }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1180px] items-center px-4">
        <ul className="flex">
          {DECISION_PAGES.map((p) => {
            const active = p.id === page
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(p.id)}
                  className={cn(
                    'border-b-2 px-3 py-2 text-[12px] transition-colors',
                    active
                      ? 'border-cesim-link font-semibold text-cesim-link'
                      : 'border-transparent text-cesim-muted hover:text-cesim-ink',
                  )}
                >
                  {p.label}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="ml-auto flex items-center gap-3">
          <a
            href={DOCS.onePager.href}
            target="_blank"
            rel="noreferrer"
            className="hidden text-[12px] text-cesim-link hover:underline sm:inline"
          >
            {DOCS.onePager.title}
          </a>
          <a
            href={DOCS.guide.href}
            target="_blank"
            rel="noreferrer"
            className="hidden text-[12px] text-cesim-link hover:underline sm:inline"
          >
            {DOCS.guide.title}
          </a>
          <a
            href={DOCS.case.href}
            target="_blank"
            rel="noreferrer"
            className="hidden text-[12px] text-cesim-link hover:underline sm:inline"
          >
            {DOCS.case.title}
          </a>
          <button
            type="button"
            onClick={onOpenProjections}
            className="my-1 rounded border border-cesim-link/40 px-3 py-1 text-[12px] font-semibold text-cesim-link hover:bg-cesim-link/5"
          >
            ⤢ Projections
          </button>
        </div>
      </div>
    </div>
  )
}
