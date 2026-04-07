import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './TopBar.module.css'

export default function TopBar({ title, showBack = false }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const firstName = user?.displayName?.split(' ')[0] || 'você'
  const displayTitle = title || `Olá, ${firstName}!`

  async function handleLogout() {
    setMenuOpen(false)
    await logout()
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Voltar">
            <BackIcon />
          </button>
        )}
        <h2 className={styles.title}>{displayTitle}</h2>
      </div>

      <div className={styles.avatarWrapper}>
        <button
          className={styles.avatar}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Perfil"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className={styles.avatarImg} />
          ) : (
            <PersonIcon />
          )}
        </button>

        {menuOpen && (
          <>
            <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
            <div className={styles.dropdown}>
              <div className={styles.dropdownUser}>
                <span className={styles.dropdownName}>{user?.displayName || 'Usuário'}</span>
                <span className={styles.dropdownEmail}>{user?.email}</span>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogoutIcon />
                Sair da conta
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
