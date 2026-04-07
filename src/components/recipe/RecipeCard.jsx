import { useAuth } from '../../context/AuthContext'
import { toggleFavorite } from '../../services/firestoreService'
import styles from './RecipeCard.module.css'

export default function RecipeCard({ recipe, onClick }) {
  const { user } = useAuth()

  async function handleFavorite(e) {
    e.stopPropagation()
    if (!user) return
    await toggleFavorite(user.uid, recipe.id, recipe.favorited)
  }

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.info}>
        <h3 className={styles.name}>{recipe.name}</h3>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <ClockIcon /> {recipe.time_minutes}min
          </span>
          {recipe.allIngredientsAvailable && (
            <span className={`${styles.metaItem} ${styles.available}`}>
              <FridgeIcon /> <CheckIcon />
            </span>
          )}
        </div>
      </div>
      <button
        className={`${styles.heartBtn} ${recipe.favorited ? styles.favorited : ''}`}
        onClick={handleFavorite}
        aria-label={recipe.favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <HeartIcon filled={recipe.favorited} />
      </button>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FridgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}>
      <path
        d="M12 21C12 21 3 15 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 6-9 12-9 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
