import { useState } from 'react'
import { HOTEL_RED } from '../../data/team'
import { FINAL_COLUMNS } from '../../data/finalResults'
import { Modal } from '../shared/Modal'

// FINAL RESULTS & SELF-ANALYSIS — a read-only end-of-game reflection (final-results
// addendum). Three category columns, each a vertical stack of Question/Answer cards. The
// question is big and chunky with an icon accent; the answer is calm body text below it.
// A "How was this calculated?" link opens the methodology modal.

const ROWS_USED = [
  ['Price', '“Room rates · Booked today” (the walk-in rate set that round)'],
  ['Nights sold', '“Room sales · Booked today” and “Total sales for this season”'],
  ['Revenue', '“Sales revenues this period”'],
  ['Net profit', '“Net profit for the period”'],
  ['Levers', 'Marketing, Maintenance, Cost saving efforts, Wage / month, Training / person, permanent and temporary headcount'],
  ['Quality & load', '“Quality level”, “Personnel stress level”'],
  ['Finance', '“Long-term loans”, “Int.exp. on long-term loans”, “Interest income”, “Dividends paid”, “Cash and cash equivalents at end of period”'],
  ['Scoreboard', '“Cumulative total shareholder return %”'],
]

const COMBINED = [
  ['Total interest paid', 'the sum of “Int.exp. on long-term loans” across Rounds 1–7 (≈ $674,000 for Hotel Red).'],
  ['Cash growth', 'end-of-period cash in Round 1 ($702,010) versus Round 7 ($1,736,104).'],
  ['Final standing', 'the Round 7 “Cumulative total shareholder return” for each team (America 13.5, Northline 11.2, Hotel Red 10.8, Blue 7.1).'],
  ['“Lever did little”', 'a lever whose value barely changed across rounds (e.g. training held at $1,000 every round; marketing near $11,200 for five rounds), so it could not account for changes in results.'],
  ['Best/worst rounds', 'comparing each team’s “Net profit for the period” round by round.'],
]

function HowCalculatedModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="How these answers were derived" width="max-w-2xl">
      <div className="space-y-4 text-[13px] leading-relaxed text-cesim-ink">
        <p>
          <span className="font-bold">Source data.</span> Every figure on the Final Results page comes directly from
          the seven official Cesim round exports (<code className="text-[12px]">results-r01.xls</code> through{' '}
          <code className="text-[12px]">results-r07.xls</code>) — the real course results for all four teams. Nothing
          is estimated or remembered; each number is read straight from the spreadsheets.
        </p>
        <div>
          <p>
            <span className="font-bold">How the files were read.</span> Each export is a single sheet of 363 rows and
            four team columns (The Northline, Hotel Red, Blue, Hotel of America). The relevant rows were located by
            their labels and pulled across all seven rounds. The specific rows used:
          </p>
          <ul className="mt-2 space-y-1">
            {ROWS_USED.map(([k, v]) => (
              <li key={k} className="flex gap-2">
                <span aria-hidden className="text-cesim-muted">•</span>
                <span><span className="font-semibold">{k}</span> — {v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p><span className="font-bold">How the figures were combined.</span> The claims are simple arithmetic on those rows:</p>
          <ul className="mt-2 space-y-1">
            {COMBINED.map(([k, v]) => (
              <li key={k} className="flex gap-2">
                <span aria-hidden className="text-cesim-muted">•</span>
                <span><span className="italic">{k}</span> = {v}</span>
              </li>
            ))}
          </ul>
        </div>
        <p>
          <span className="font-bold">Facts versus interpretation.</span> The numbers are facts, traceable to a
          specific row and round in the spreadsheets. The surrounding narrative — for example, “played it safe during
          the summer booms,” or “high variance was punished over a long game” — is interpretation: a reasoned reading
          of the patterns, the kind an analyst would offer. The data supports the direction of each claim; the framing
          is judgment, not proof.
        </p>
        <p>
          <span className="font-bold">A note on certainty.</span> With four teams over seven rounds, these are observed
          patterns and correlations, not controlled experiments. “Marketing did little for Hotel Red” means marketing
          barely changed while results moved for other reasons — a fair inference, not a demonstrated cause. The
          distinction matters when presenting this analysis formally.
        </p>
      </div>
    </Modal>
  )
}

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
  const [howOpen, setHowOpen] = useState(false)
  return (
    <div>
      {/* Header — Hotel Red identity + the team */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <img src="/hotel-red-logo.svg" alt="Hotel Red" className="h-11 w-auto" />
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-cesim-ink">Final Results &amp; Self-Analysis</h1>
            <p className="text-[12px] text-cesim-muted">Mini MBA June 2026 · 7 rounds complete · a retrospective</p>
          </div>
        </div>
        <div className="text-right text-[12px] text-cesim-muted">
          <button
            type="button"
            onClick={() => setHowOpen(true)}
            className="mb-2 text-[12px] font-semibold text-cesim-link hover:underline"
          >
            How was this calculated?
          </button>
          <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-cesim-rule">Team — Hotel Red</div>
          {HOTEL_RED.members.map((m) => (
            <span key={m.name} className="ml-2 inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-cesim-ink">{m.name}</span>
            </span>
          ))}
        </div>
      </div>

      <HowCalculatedModal open={howOpen} onClose={() => setHowOpen(false)} />

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
