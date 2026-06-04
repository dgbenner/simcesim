/* eslint-disable react-refresh/only-export-components -- provider + hook co-located by design */
import { createContext, useContext, useState, useMemo, useCallback } from 'react'

// Lightweight UI + navigation state shared across the app: the active section/page, the
// field teaching modal, the dock explain target, and the overlay modals (Projections,
// past-results).
const UIContext = createContext(null)

export function UIProvider({ children }) {
  // Navigation
  const [section, setSection] = useState('decisions') // 'decisions' | 'results'
  const [page, setPage] = useState('sales') // decision sub-page
  const [resultsTab, setResultsTab] = useState('market') // results sub-tab

  // Overlays / dock
  const [modalField, setModalField] = useState(null)
  const [explainField, setExplainField] = useState(null)
  const [projectionsOpen, setProjectionsOpen] = useState(false)
  const [pastResultsOpen, setPastResultsOpen] = useState(false)

  const openField = useCallback((id) => setModalField(id), [])
  const closeField = useCallback(() => setModalField(null), [])
  const explain = useCallback((id) => setExplainField(id), [])

  const goToResults = useCallback((tab) => {
    if (tab) setResultsTab(tab)
    setPastResultsOpen(false)
    setSection('results')
  }, [])

  const goToDecision = useCallback((pg) => {
    if (pg) setPage(pg)
    setSection('decisions')
  }, [])

  const value = useMemo(
    () => ({
      section,
      setSection,
      page,
      setPage,
      resultsTab,
      setResultsTab,
      goToResults,
      goToDecision,
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
      goToResults,
      goToDecision,
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
