import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CurrencySignalBot from './CurrencySignalBot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrencySignalBot />
  </StrictMode>,
)
