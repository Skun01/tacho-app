import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NProgress from 'nprogress'
import './index.css'
import 'nprogress/nprogress.css'
import App from './App.tsx'
import { setupInterceptors } from './services/setupInterceptors'

NProgress.configure({ showSpinner: false })
setupInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
