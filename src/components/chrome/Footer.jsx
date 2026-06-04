import { COURSE } from '../../data/team'
import { DOCS } from '../../data/docs'

// Faithful footer: course info + support/reading. The two source docs open in a new
// tab (they also feed the explain layer / v2 chatbot). Support + Sitemap are disabled.
// The single global USD note lives here so it isn't repeated on every field.
export function Footer() {
  return (
    <footer className="mt-8 bg-surface-footer text-[12px] text-cesim-muted">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-4 py-7 md:grid-cols-3">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-3xl font-light tracking-tight">◎ cesim</span>
        </div>

        <div>
          <div className="mb-2 font-bold text-cesim-ink">Course info</div>
          <div>Course: {COURSE.name}</div>
          <div>Universe &amp; Code: {COURSE.universe}</div>
          <div>Instructor: {COURSE.instructor}</div>
          <div>
            {COURSE.roundLabel} deadline: {COURSE.roundDeadline}
          </div>
        </div>

        <div>
          <div className="mb-2 font-bold text-cesim-ink">Support and reading</div>
          <a
            className="block text-cesim-link hover:underline"
            href={DOCS.guide.href}
            target="_blank"
            rel="noreferrer"
          >
            Decision-making guide
          </a>
          <a
            className="block text-cesim-link hover:underline"
            href={DOCS.case.href}
            target="_blank"
            rel="noreferrer"
          >
            Case description
          </a>
          <span className="block cursor-default text-gray-400">Support</span>
          <span className="block cursor-default text-gray-400">Sitemap</span>
        </div>
      </div>

      <div className="border-t border-gray-300/60">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] text-gray-400">
          <span>© 2000–2026 SIMCESIM — an MBA capstone re-build of Cesim Service.</span>
          <span>All monetary figures denominated in USD ($).</span>
        </div>
      </div>
    </footer>
  )
}
