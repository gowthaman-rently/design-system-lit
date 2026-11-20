import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Registers the design-system custom elements (<my-element>, ...) once for the whole app.
import '@design-system-poc/ui'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
