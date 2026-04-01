import {BrowserRouter, Route, Routes} from 'react-router'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { GooeyToaster } from './components/ui/goey-toaster'

function App() {
  return <>
    <GooeyToaster position='top-right'/>
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={<LandingPage/>}
        />

        <Route
          path='/login'
          element={<LoginPage/>}
        />
        <Route
          path='/register'
          element={<RegisterPage/>}
        />

        {/* protected routes */}
        <Route
          path='/dashboard'
          element={<DashboardPage/>}
        />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
