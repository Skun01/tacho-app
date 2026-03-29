import { useEffect } from 'react'
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
import { QuizPage } from './pages/QuizPage'
import { QuizConfigPage } from './pages/QuizConfigPage'
import { QuizResultPage } from './pages/QuizResultPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { QuickStudyPage } from './pages/QuickStudyPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { GooeyToaster } from './components/ui/goey-toaster'
import { TopLoadingBar } from './components/ui/top-loading-bar'
import { useAuthStore } from './stores/authStore'

function AppRoutes() {
  return (
    <>
      <TopLoadingBar />
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={<HomePage/>}
        />

        <Route element={<GuestRoute/>}>
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
        </Route>

        {/* protected routes */}
        <Route element={<ProtectedRoute/>}>
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
            path='/quiz/config'
            element={<QuizConfigPage/>}
          />
          <Route
            path='/quiz'
            element={<QuizPage/>}
          />
          <Route
            path='/quiz/result'
            element={<QuizResultPage/>}
          />
          <Route
            path='/profile'
            element={<ProfilePage/>}
          />
          <Route
            path='/settings'
            element={<SettingsPage/>}
          />
          <Route
            path='/quick-study'
            element={<QuickStudyPage/>}
          />
          <Route
            path='/deck/:id'
            element={<DeckViewPage/>}
          />
          <Route
            path='/deck/:id/edit'
            element={<DeckEditPage/>}
          />
          <Route
            path='/notifications'
            element={<NotificationsPage/>}
          />
        </Route>
      </Routes>
    </>
  )
}

function App() {
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    void init()
  }, [init])

  return (
    <>
      <GooeyToaster position='top-right' />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
