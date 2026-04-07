import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { toggleFavorite } from '../../services/firestoreService'
import ToasterMascot from '../../components/ui/ToasterMascot'
import Spinner from '../../components/ui/Spinner'
import styles from './RecipeDetailPage.module.css'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(location.state?.recipe || null)
  const [loading, setLoading] = useState(!recipe)
  const [error, setError] = useState('')
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    if (recipe) return
    async function fetchRecipe() {
      try {
        const ref = doc(db, 'users', user.uid, 'recipes', id)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setRecipe({ id: snap.id, ...snap.data() })
        } else {
          setError('Receita não encontrada.')
        }
      } catch {
        setError('Erro ao carregar receita.')
      } finally {
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [id, user, recipe])

  async function handleFavorite() {
    if (!recipe) return
    await toggleFavorite(user.uid, recipe.id, recipe.favorited)
    setRecipe((r) => ({ ...r, favorited: !r.favorited }))
  }

  async function handleShare() {
    if (!recipe) return
    const text = buildShareText(recipe)
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.name, text })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setShareMsg('Receita copiada!')
      setTimeout(() => setShareMsg(''), 2500)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <Spinner size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.loadingPage}>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>Voltar</button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <ToasterMascot size={80} />
        <h1 className={styles.name}>{recipe.name}</h1>

        <div className={styles.metaRow}>
          <MetaBadge icon={<ClockIcon />} label={`${recipe.time_minutes} min`} />
          <MetaBadge icon={<StarIcon />} label={recipe.difficulty} />
          {recipe.servings && <MetaBadge icon={<PeopleIcon />} label={`${recipe.servings} porções`} />}
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleShare} title="Compartilhar">
            <ShareIcon />
          </button>
          <button
            className={`${styles.actionBtn} ${recipe.favorited ? styles.favActive : ''}`}
            onClick={handleFavorite}
            title={recipe.favorited ? 'Remover favorito' : 'Favoritar'}
          >
            <HeartIcon filled={recipe.favorited} />
          </button>
        </div>
        {shareMsg && <p className={styles.shareMsg}>{shareMsg}</p>}
      </div>

      <div className={styles.card}>
        {recipe.description && (
          <p className={styles.description}>{recipe.description}</p>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FridgeIcon /> Ingredientes
          </h2>
          <ul className={styles.ingredientList}>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} className={styles.ingredientItem}>
                <span className={styles.dot} />
                <span className={styles.ingName}>{ing.name}</span>
                <span className={styles.ingQty}>{ing.quantity}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <ListIcon /> Modo de preparo
          </h2>
          <ol className={styles.stepList}>
            {recipe.steps?.map((step, i) => (
              <li key={i} className={styles.stepItem}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

function MetaBadge({ icon, label }) {
  return (
    <div className={styles.badge}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

function buildShareText(recipe) {
  const steps = recipe.steps?.map((s, i) => `${i + 1}. ${s}`).join('\n') || ''
  const ings = recipe.ingredients?.map((i) => `- ${i.name}: ${i.quantity}`).join('\n') || ''
  return `🍽 ${recipe.name}\n⏱ ${recipe.time_minutes} min · ${recipe.difficulty}\n\nIngredientes:\n${ings}\n\nModo de preparo:\n${steps}\n\n— Chef da Despensa`
}

function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function StarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
}
function PeopleIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/><path d="M3 20c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="2"/><path d="M19 20c0-2.76-1.79-5-4-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function ShareIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function HeartIcon({ filled }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}><path d="M12 21C12 21 3 15 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 6-9 12-9 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function FridgeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="6.5" r="1.2" fill="currentColor"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/></svg>
}
function ListIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="3.5" cy="6" r="1.5" fill="currentColor"/><circle cx="3.5" cy="12" r="1.5" fill="currentColor"/><circle cx="3.5" cy="18" r="1.5" fill="currentColor"/></svg>
}
