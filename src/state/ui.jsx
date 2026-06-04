/* eslint-disable react-refresh/only-export-components -- provider + hook co-located by design */
import { createContext, useContext, useState, useMemo, useCallback } from 'react'

// Lightweight UI state shared across the app: which field's teaching modal is open,
// which field the dock is explaining, and whether the Projections lightbox is open.
const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [modalField, setModalField] = useState(null)
  const [explainField, setExplainField] = useState(null)
  const [projectionsOpen, setProjectionsOpen] = useState(false)

  const openField = useCallback((id) => setModalField(id), [])
  const closeField = useCallback(() => setModalField(null), [])
  const explain = useCallback((id) => setExplainField(id), [])

  const value = useMemo(
    () => ({
      modalField,
      openField,
      closeField,
      explainField,
      explain,
      projectionsOpen,
      setProjectionsOpen,
    }),
    [modalField, openField, closeField, explainField, explain, projectionsOpen],
  )
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
