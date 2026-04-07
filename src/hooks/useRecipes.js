import { useEffect, useState } from 'react'
import { subscribeRecipes } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'

export function useRecipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeRecipes(
      user.uid,
      (items) => {
        setRecipes(items)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return unsub
  }, [user])

  return { recipes, loading }
}

export function useFavorites() {
  const { recipes, loading } = useRecipes()
  return {
    recipes: recipes.filter((r) => r.favorited),
    loading,
  }
}
