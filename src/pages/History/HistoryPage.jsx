import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../../hooks/useRecipes'
import RecipeCard from '../../components/recipe/RecipeCard'
import PetMascot from '../../components/ui/PetMascot'
import Spinner from '../../components/ui/Spinner'
import styles from './HistoryPage.module.css'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { recipes, loading } = useRecipes()

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <PetMascot mood="buscandoReceita" size={70} />
        <h1 className={styles.title}>Histórico de receitas</h1>
      </div>

      {loading ? (
        <div className={styles.center}>
          <Spinner size={40} />
        </div>
      ) : recipes.length === 0 ? (
        <div className={styles.empty}>
          <p>Ainda não gerou nenhuma receita.</p>
          <button className={styles.goHome} onClick={() => navigate('/')}>
            Criar primeira receita
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
