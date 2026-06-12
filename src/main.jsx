import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DecisionsProvider } from './state/decisions.jsx'
import { UIProvider } from './state/ui.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <DecisionsProvider>
        <App />
      </DecisionsProvider>
    </UIProvider>
  </StrictMode>,
)
