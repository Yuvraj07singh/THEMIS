import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { CountryProvider } from './contexts/CountryContext'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CountryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CountryProvider>
    </ThemeProvider>
  </StrictMode>,
)
