import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../hifz-tracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
