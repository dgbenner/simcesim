import { useMemo } from 'react'
import { useUI } from '../../state/ui'
import { DOCS } from '../../data/docs'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'

// TUTORIAL — the 7-step process outline. Each step has a number (what to do), a
// description (what to look at), and a yellow "how to work through it" methodology — short
// guardrails distilled from the decision-making guide, in columns, that rotate per visit.

// Methodology pools, one per step (by index). A random few show each visit. Distilled
// from the decision-making guide + case so the tutorial reads like a teacher alongside you.
const STEP_HOW = [
  [
    'Skim the guide for the order decisions must be made in.',
    "Note why winter is soft and why the owner wants dividends (case).",
    'Find the ratio definitions so the scoreboard makes sense later.',
    "Don't memorize — just know where to look things up.",
  ],
  [
    'Results → Market report: last round’s rate and how full it got.',
    'Treat that occupancy as your realistic ceiling, not the full 9,000.',
    'Check how you stacked up against rivals on the Sorting tab.',
    'Anything that surprised you last round is where to adjust.',
  ],
  [
    'Confirm the season — winter leans on less price-sensitive business travelers.',
    "Note the costs and interest rates you can't change this round.",
    'Demand resolves live against competitors — treat it as a guide, not a guarantee.',
  ],
  [
    "You're Dan Benner on Hotel Red — your column drives the figures.",
    'Ignore the ghosted competitor columns; you only control your own.',
  ],
  [
    'Sales first: anchor your rate to last round; nights ≈ occupancy × capacity.',
    'Operations next: size staff and maintenance to the demand you forecast.',
    "Finance last: set loans and dividends once the cash picture is clear.",
    'Watch the strip fill in as you complete each section.',
  ],
  [
    'Projections: is net profit positive, and does the balance sheet balance?',
    'If a figure looks wrong, trace it back to the decision that drives it.',
    'Tweak one lever, re-check, repeat — that’s the loop.',
  ],
  [
    'Confirm every value on the Decision checklist before the deadline.',
    "Nothing left blank — the strip counter should read complete.",
  ],
]

// Return up to n random items from arr (stable per call).
function pick(arr, n) {
  if (!arr || arr.length <= n) return arr ?? []
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  return out
}

function HowTo({ items }) {
  if (!items.length) return null
  return (
    <div className="mt-2 rounded border-l-2 border-amber-400 bg-amber-50 p-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-800">
        <span aria-hidden>💡</span> How to work through it
      </div>
      <ul className="grid gap-x-5 gap-y-1 text-[11px] leading-snug text-amber-900 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((h, j) => (
          <li key={j} className="flex gap-1.5">
            <span aria-hidden className="text-amber-500">•</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TutorialPage({ onNavigate }) {
  const { setProjectionsOpen } = useUI()

  // Roll a fresh subset of methodology bullets per visit (re-mounts on navigation).
  const shownHow = useMemo(() => STEP_HOW.map((pool) => pick(pool, 3)), [])

  const steps = [
    {
      title: 'Read the accompanying materials',
      body: (
        <>
          Start with the{' '}
          <a className="text-cesim-link hover:underline" href={DOCS.guide.href} target="_blank" rel="noreferrer">decision-making guide</a>{' '}
          and the{' '}
          <a className="text-cesim-link hover:underline" href={DOCS.case.href} target="_blank" rel="noreferrer">case description</a>.
        </>
      ),
    },
    { title: 'Review the market situation', body: 'Look at last round’s results and where the company stands.' },
    {
      title: 'Read the market outlook',
      body: (
        <>
          Check the season’s parameters and demand picture on the{' '}
          <button type="button" className="text-cesim-link hover:underline" onClick={() => onNavigate('outlook')}>Market outlook</button> page.
        </>
      ),
    },
    { title: 'Choose your decision area', body: 'Your own Student area (Dan Benner) within Hotel Red.' },
    {
      title: 'Make decisions',
      body: (
        <>
          <p>The heart of the round. Fill them in dependency order:</p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-cesim-link/60 bg-cesim-link/5 px-3 py-1.5 text-[13px]">
            <button type="button" className="font-semibold text-cesim-link hover:underline" onClick={() => onNavigate('sales')}>Sales</button>
            <span className="text-cesim-muted">→</span>
            <button type="button" className="font-semibold text-cesim-link hover:underline" onClick={() => onNavigate('operations')}>Operations</button>
            <span className="text-cesim-muted">→</span>
            <button type="button" className="font-semibold text-cesim-link hover:underline" onClick={() => onNavigate('finance')}>Finance</button>
          </div>
          <p className="mt-1.5">The strip above steps you through and loops.</p>
        </>
      ),
    },
    {
      title: 'Review budgets',
      body: (
        <>
          Open the{' '}
          <button type="button" className="text-cesim-link hover:underline" onClick={() => setProjectionsOpen(true)}>Projections</button>{' '}
          to check your forecast income statement and balance sheet.
        </>
      ),
    },
    { title: "Copy as team's decisions", body: 'Once you’re satisfied, commit your decisions as the team’s (see the Decision checklist).' },
  ]

  return (
    <div>
      <PageHeader
        title="Tutorial"
        subtitle="The full decision process, start to finish. The strip above makes the decision steps concrete and loops them."
      />
      <Section title="The Decision Process">
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cesim-link text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-cesim-ink">{s.title}</div>
                <div className="text-[13px] leading-relaxed text-cesim-muted">{s.body}</div>
                <HowTo items={shownHow[i]} />
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}
