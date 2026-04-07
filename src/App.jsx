import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import TopBar from './components/layout/TopBar'
import BottomNav from './components/layout/BottomNav'
import Spinner from './components/ui/Spinner'

import LoginPage from './pages/Login/LoginPage'
import HomePage from './pages/Home/HomePage'
import HistoryPage from './pages/History/HistoryPage'
import FavoritesPage from './pages/Favorites/FavoritesPage'
import PantryPage from './pages/Pantry/PantryPage'
import RecipeDetailPage from './pages/RecipeDetail/RecipeDetailPage'

function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={48} />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <TopBar />
      <Outlet />
      <BottomNav />
    </>
  )
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={48} />
      </div>
    )
  }
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route element={<ProtectedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="pantry" element={<PantryPage />} />
        <Route path="recipe/:id" element={<RecipeDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
