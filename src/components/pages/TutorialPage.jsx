import { useMemo } from 'react'
import { useUI } from '../../state/ui'
import { DOCS } from '../../data/docs'
import { getCoaching } from '../../data/coachingTips'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'

// TUTORIAL — the 7-step process outline. Each step has a number (what to do) and a
// description (what to look at). Steps 2–6 also carry a third tier: a rotating "coaching"
// set from coachingTips.js — a quiet one-word header over three pointing bullets. Steps 1
// and 7 are self-evident and get no coaching block.

// One coaching set (three verb-first bullets), styled as the small accent block under a
// step. No header — the step title frames it; a 💡 marks it as guidance. Content comes
// entirely from the data file.
function Coaching({ bullets }) {
  if (!bullets || !bullets.length) return null
  return (
    <div className="mt-2 flex gap-2 rounded border-l-2 border-amber-400 bg-amber-50 p-2.5">
      <span aria-hidden className="select-none leading-none">💡</span>
      <ul className="grid flex-1 gap-x-5 gap-y-1 text-[11px] leading-snug text-amber-900 sm:grid-cols-2 lg:grid-cols-3">
        {bullets.map((b, j) => (
          <li key={j} className="flex gap-1.5">
            <span aria-hidden className="text-amber-500">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TutorialPage({ onNavigate }) {
  const { setProjectionsOpen } = useUI()

  // Roll a coaching set per step once per visit (the page remounts on navigation, so a
  // return trip shuffles to different coaching). Steps without coaching return null.
  const coaching = useMemo(
    () => Array.from({ length: 7 }, (_, i) => getCoaching(i + 1, { random: true })),
    [],
  )

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
                <Coaching bullets={coaching[i]} />
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}
