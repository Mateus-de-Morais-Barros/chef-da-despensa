import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../hooks/useRecipes'
import RecipeCard from '../../components/recipe/RecipeCard'
import PetMascot from '../../components/ui/PetMascot'
import Spinner from '../../components/ui/Spinner'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { recipes, loading } = useFavorites()

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <PetMascot mood="buscandoReceita" size={70} />
        <h1 className={styles.title}>Receitas favoritas</h1>
      </div>

      {loading ? (
        <div className={styles.center}>
          <Spinner size={40} />
        </div>
      ) : recipes.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhuma receita favoritada ainda.</p>
          <p>Toque no ❤️ em qualquer receita para salvar aqui.</p>
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
