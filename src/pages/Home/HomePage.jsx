import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePantry } from '../../hooks/usePantry'
import { generateRecipe } from '../../services/geminiService'
import { saveRecipe } from '../../services/firestoreService'
import PetMascot from '../../components/ui/PetMascot'
import WavyDecor from '../../components/ui/WavyDecor'
import Spinner from '../../components/ui/Spinner'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { ingredients } = usePantry()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!navigator.onLine) {
      setError('Você está offline. Conecte-se à internet para gerar receitas.')
      return
    }
    if (ingredients.length === 0) {
      setError('Adicione ingredientes à sua despensa primeiro!')
      return
    }

    setLoading(true)
    setError('')

    try {
      const recipe = await generateRecipe(ingredients)
      const recipeId = await saveRecipe(user.uid, recipe, ingredients)
      navigate(`/recipe/${recipeId}`, { state: { recipe: { ...recipe, id: recipeId } } })
    } catch (e) {
      setError(e.message || 'Erro ao gerar receita. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <WavyDecor position="top" />

      <div className={styles.center}>
        <div className={styles.mascotWrapper}>
          {loading ? <Spinner size={56} /> : <PetMascot mood="feliz" size={140} />}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.ctaBtn}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Criando sua receita...' : (
            <>
              <ChefIcon />
              Vamos cozinhar algo novo?
            </>
          )}
        </button>

        {ingredients.length > 0 && (
          <p className={styles.hint}>
            {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} na despensa
          </p>
        )}
      </div>

      <WavyDecor position="bottom" />
    </div>
  )
}

function ChefIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 2 7.46V20H6v-6.54A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
