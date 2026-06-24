/* eslint-disable react-refresh/only-export-components -- provider + hook co-located by design */
import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { LAST_COMPLETED_ROUND, CURRENT_ROUND } from '../data/config'

// Lightweight UI + navigation state shared across the app: the active section/page, the
// field teaching modal, the dock explain target, the overlay modals (Projections,
// past-results), and which past round the Results section is reviewing.
const UIContext = createContext(null)

export function UIProvider({ children }) {
  // Navigation
  const [section, setSection] = useState('home') // 'home' | 'decisions' | 'results'
  const [page, setPage] = useState('sales') // decision sub-page
  const [resultsTab, setResultsTab] = useState('market') // results sub-tab
  const [viewRound, setViewRound] = useState(LAST_COMPLETED_ROUND) // round under review in Results
  const [decisionRound, setDecisionRound] = useState(CURRENT_ROUND) // round shown in Decisions (past = locked)

  // Overlays / dock
  const [modalField, setModalField] = useState(null)
  const [explainField, setExplainField] = useState(null)
  const [projectionsOpen, setProjectionsOpen] = useState(false)
  const [pastResultsOpen, setPastResultsOpen] = useState(false)

  const openField = useCallback((id) => setModalField(id), [])
  const closeField = useCallback(() => setModalField(null), [])
  const explain = useCallback((id) => setExplainField(id), [])

  const goToResults = useCallback((tab, round) => {
    if (tab) setResultsTab(tab)
    if (round) setViewRound(round)
    setPastResultsOpen(false)
    setSection('results')
  }, [])

  const goToDecision = useCallback((pg) => {
    if (pg) setPage(pg)
    setSection('decisions')
  }, [])

  const goToHome = useCallback(() => setSection('home'), [])
  const goToFinal = useCallback(() => setSection('final'), [])

  const value = useMemo(
    () => ({
      section,
      setSection,
      page,
      setPage,
      resultsTab,
      setResultsTab,
      viewRound,
      setViewRound,
      decisionRound,
      setDecisionRound,
      goToResults,
      goToDecision,
      goToHome,
      goToFinal,
      modalField,
      openField,
      closeField,
      explainField,
      explain,
      projectionsOpen,
      setProjectionsOpen,
      pastResultsOpen,
      setPastResultsOpen,
    }),
    [
      section,
      page,
      resultsTab,
      viewRound,
      decisionRound,
      goToResults,
      goToDecision,
      goToHome,
      goToFinal,
      modalField,
      openField,
      closeField,
      explainField,
      explain,
      projectionsOpen,
      pastResultsOpen,
    ],
  )
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
