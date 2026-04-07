import { useEffect, useState } from 'react'
import { subscribePantry } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'

export function usePantry() {
  const { user } = useAuth()
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    const unsub = subscribePantry(
      user.uid,
      (items) => {
        setIngredients(items)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [user])

  return { ingredients, loading, error }
}
