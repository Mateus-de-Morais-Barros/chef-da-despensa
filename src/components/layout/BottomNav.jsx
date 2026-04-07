import { useLocation, useNavigate } from 'react-router-dom'
import styles from './BottomNav.module.css'

const tabs = [
  { path: '/', label: 'Início', icon: HomeIcon },
  { path: '/history', label: 'Histórico', icon: HistoryIcon },
  { path: '/favorites', label: 'Favoritos', icon: HeartIcon },
  { path: '/pantry', label: 'Despensa', icon: PantryIcon },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className={styles.nav}>
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = path === '/'
          ? location.pathname === '/'
          : location.pathname === path
        return (
          <button
            key={path}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => navigate(path)}
            aria-label={label}
          >
            <Icon />
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 11L12 3l9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9v11a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 9 Q2 5 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 9 L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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

function PantryIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    </svg>
  )
}
