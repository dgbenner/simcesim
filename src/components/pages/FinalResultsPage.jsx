import { HOTEL_RED } from '../../data/team'
import { FINAL_COLUMNS } from '../../data/finalResults'

// FINAL RESULTS & SELF-ANALYSIS — a read-only end-of-game reflection (final-results
// addendum). Three category columns, each a vertical stack of Question/Answer cards. The
// question is big and chunky with an icon accent; the answer is calm body text below it.

function QACard({ icon, q, a }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-2.5">
        <span aria-hidden className="text-[22px] leading-none">{icon}</span>
        <h3 className="text-[15px] font-bold leading-snug tracking-tight text-cesim-ink">{q}</h3>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-cesim-muted">{a}</p>
    </div>
  )
}

export function FinalResultsPage() {
  return (
    <div>
      {/* Header — Hotel Red identity + the team */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <img src="/hotel-red-logo.svg" alt="Hotel Red" className="h-11 w-auto" />
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-cesim-ink">Final Results &amp; Self-Analysis</h1>
            <p className="text-[12px] text-cesim-muted">Mini MBA June 2026 · 7 rounds complete · a retrospective</p>
          </div>
        </div>
        <div className="text-right text-[12px] text-cesim-muted">
          <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-cesim-rule">Team — Hotel Red</div>
          {HOTEL_RED.members.map((m) => (
            <span key={m.name} className="ml-2 inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-cesim-ink">{m.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Three category columns of cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {FINAL_COLUMNS.map((col) => (
          <section key={col.key}>
            <div className="mb-3">
              <h2 className="text-[16px] font-bold tracking-tight text-cesim-ink">{col.header}</h2>
              <p className="text-[11px] uppercase tracking-wide text-cesim-muted">{col.blurb}</p>
              <div className="mt-1 h-0.5 w-10 rounded bg-purple-500" />
            </div>
            <div className="space-y-4">
              {col.cards.map((c, i) => (
                <QACard key={i} {...c} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-cesim-muted">
        A reflective summary of the completed game. Figures trace to the real round exports — download them from the bar above.
      </p>
    </div>
  )
}
