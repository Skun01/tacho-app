import { BrowserRouter, Route, Routes } from 'react-router'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { LibraryPage } from './pages/LibraryPage'
import { DeckEditPage } from './pages/DeckEditPage'
import { DeckViewPage } from './pages/DeckViewPage'
import { SearchPage } from './pages/SearchPage'
import { CardDetailPage } from './pages/CardDetailPage'
import { StudyPage } from './pages/StudyPage'
import { GooeyToaster } from './components/ui/goey-toaster'

function App() {
  return <>
    <GooeyToaster position='top-right'/>
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={<HomePage/>}
        />

        <Route
          path='/login'
          element={<LoginPage/>}
        />
        <Route
          path='/register'
          element={<RegisterPage/>}
        />
        <Route
          path='/forgot-password'
          element={<ForgotPasswordPage/>}
        />
        <Route
          path='/reset-password'
          element={<ResetPasswordPage/>}
        />

        {/* protected routes */}
        <Route
          path='/dashboard'
          element={<DashboardPage/>}
        />
        <Route
          path='/library'
          element={<LibraryPage/>}
        />
        <Route
          path='/search'
          element={<SearchPage/>}
        />
        <Route
          path='/card/:id'
          element={<CardDetailPage/>}
        />
        <Route
          path='/study'
          element={<StudyPage/>}
        />
        <Route
          path='/deck/:id'
          element={<DeckViewPage/>}
        />
        <Route
          path='/deck/:id/edit'
          element={<DeckEditPage/>}
        />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
