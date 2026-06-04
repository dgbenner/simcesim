import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DecisionsProvider } from './state/decisions.jsx'
import { UIProvider } from './state/ui.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DecisionsProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </DecisionsProvider>
  </StrictMode>,
)
