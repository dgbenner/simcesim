import { TopBar } from './components/chrome/TopBar'
import { SubNav } from './components/chrome/SubNav'
import { Footer } from './components/chrome/Footer'
import { SalesPage } from './components/pages/SalesPage'
import { OperationsPage } from './components/pages/OperationsPage'
import { FinancePage } from './components/pages/FinancePage'
import { DecisionChecklistPage } from './components/pages/DecisionChecklistPage'
import { MarketOutlookPage } from './components/pages/MarketOutlookPage'
import { TutorialPage } from './components/pages/TutorialPage'
import { ResultsPage } from './components/pages/ResultsPage'
import { HomePage } from './components/pages/HomePage'
import { HowToReadPanel } from './components/dock/HowToReadPanel'
import { ExplainDrawer } from './components/dock/ExplainDrawer'
import { Principle } from './components/shared/Principle'
import { DecisionLoopStrip } from './components/strip/DecisionLoopStrip'
import { FieldEntryModal } from './components/modals/FieldEntryModal'
import { ProjectionsModal } from './components/modals/ProjectionsModal'
import { PastResultsModal } from './components/modals/PastResultsModal'
import { useUI } from './state/ui'
import { useDecisions } from './state/decisions'
import { ROUND_META } from './data/roundResults'
import { CURRENT_ROUND } from './data/config'

// Shown above the decision pages when a COMPLETED round is selected: these decisions are
// the real ones Hotel Red entered that round, locked. Editing happens on the live round.
function DecisionReviewBanner() {
  const { readOnly, round } = useDecisions()
  const { setDecisionRound, goToResults } = useUI()
  if (!readOnly) return null
  const meta = ROUND_META[round]
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded border-l-2 border-amber-400 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
      <span aria-hidden>🔒</span>
      <span>
        <span className="font-semibold">{meta?.label} — completed.</span> Review only — these are the decisions
        Hotel Red actually made that round, with their results locked in.
      </span>
      <button type="button" onClick={() => goToResults('market', round)} className="font-semibold underline hover:text-amber-950">
        See its results →
      </button>
      <button type="button" onClick={() => setDecisionRound(CURRENT_ROUND)} className="font-semibold underline hover:text-amber-950">
        Back to the live round (Round {CURRENT_ROUND} · Summer)
      </button>
    </div>
  )
}

// Maps each page to the principle pool it draws from (see contexts in principles.js).
const PRINCIPLE_CONTEXT = {
  sales: 'sales',
  operations: 'operations',
  finance: 'finance',
  outlook: 'strategy',
  tutorial: 'any',
  checklist: 'any',
}

export default function App() {
  const { section, page, setPage, setProjectionsOpen } = useUI()
  const inResults = section === 'results'
  const inHome = section === 'home'
  const inDecisions = section === 'decisions'

  return (
    <div className="flex min-h-full flex-col">
      <TopBar />

      {inDecisions && (
        <>
          <DecisionLoopStrip page={page} onNavigate={setPage} />
          <SubNav page={page} onNavigate={setPage} onOpenProjections={() => setProjectionsOpen(true)} />
        </>
      )}

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-5">
        {inHome ? (
          <HomePage />
        ) : inResults ? (
          <ResultsPage />
        ) : (
          <div>
            <DecisionReviewBanner />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
            {/* Base layer: the decision page */}
            <div>
              {page === 'tutorial' && <TutorialPage onNavigate={setPage} />}
              {page === 'outlook' && <MarketOutlookPage />}
              {page === 'sales' && <SalesPage />}
              {page === 'operations' && <OperationsPage />}
              {page === 'finance' && <FinancePage />}
              {page === 'checklist' && <DecisionChecklistPage />}
            </div>

            {/* Right rail: persistent legend + a page-scoped business principle that
                re-rolls on each visit (keyed by page so it remounts). */}
            <div className="space-y-4">
              <HowToReadPanel />
              <Principle key={page} contextKey={PRINCIPLE_CONTEXT[page] ?? 'any'} />
            </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Overlays */}
      <ExplainDrawer />
      <FieldEntryModal />
      <ProjectionsModal />
      <PastResultsModal />
    </div>
  )
}
