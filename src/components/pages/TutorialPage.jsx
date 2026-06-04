import { useUI } from '../../state/ui'
import { DOCS } from '../../data/docs'
import { Section } from '../shared/Section'
import { PageHeader } from '../shared/PageHeader'

// TUTORIAL — really the 7-step process outline (not a tutorial). The decision-loop strip
// makes step 5 concrete; this page lays out the whole sequence with working jumps.
export function TutorialPage({ onNavigate }) {
  const { setProjectionsOpen } = useUI()

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
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cesim-link text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <div className="text-[14px] font-semibold text-cesim-ink">{s.title}</div>
                <div className="text-[13px] leading-relaxed text-cesim-muted">{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}
