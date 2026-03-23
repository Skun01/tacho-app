import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupInterceptors } from './services/setupInterceptors'
import { useThemeStore } from './stores/themeStore'

setupInterceptors()
useThemeStore.getState().init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
