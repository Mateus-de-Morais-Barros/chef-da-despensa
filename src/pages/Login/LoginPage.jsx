import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../../firebase/config'
import PetMascot from '../../components/ui/PetMascot'
import WavyDecor from '../../components/ui/WavyDecor'
import Spinner from '../../components/ui/Spinner'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const clearError = () => setError('')

  async function handleGoogle() {
    setLoading(true)
    clearError()
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (e) {
      console.error('Google login error:', e.code, e.message)
      setError('Erro ao entrar com Google. Tente novamente.')
      setLoading(false)
    }
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    clearError()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (e) {
      setError('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setLoading(true)
    clearError()
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })
      navigate('/')
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso.')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    clearError()
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
    } catch (e) {
      setError('Email não encontrado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <WavyDecor position="top" />

      <div className={styles.content}>
        <PetMascot mood="feliz" size={100} />

        {mode === 'signin' && (
          <>
            <h1 className={styles.title}>Entre em sua conta!</h1>

            <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
              <GoogleIcon />
              Entrar com Google
            </button>

            <div className={styles.divider}>
              <span>ou</span>
            </div>

            <form onSubmit={handleSignIn} className={styles.form}>
              <input
                className={styles.input}
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.link}
                onClick={() => { setMode('reset'); clearError() }}
              >
                Esqueci minha senha
              </button>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.primaryBtn} type="submit" disabled={loading}>
                {loading ? <Spinner size={20} color="#fff" /> : 'Entrar'}
              </button>
            </form>

            <button
              className={styles.outlineBtn}
              onClick={() => { setMode('signup'); clearError() }}
            >
              Criar conta
            </button>
          </>
        )}

        {mode === 'signup' && (
          <>
            <h1 className={styles.title}>Crie sua conta!</h1>
            <form onSubmit={handleSignUp} className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.primaryBtn} type="submit" disabled={loading}>
                {loading ? <Spinner size={20} color="#fff" /> : 'Cadastrar'}
              </button>
            </form>
            <button className={styles.link} onClick={() => { setMode('signin'); clearError() }}>
              Já tenho uma conta
            </button>
          </>
        )}

        {mode === 'reset' && (
          <>
            <PetMascot mood="feliz" size={80} />
            {resetSent ? (
              <p className={styles.successMsg}>
                Enviamos um link de recuperação para o seu email!
              </p>
            ) : (
              <>
                <h1 className={styles.title}>Recuperar senha</h1>
                <form onSubmit={handleReset} className={styles.form}>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  {error && <p className={styles.error}>{error}</p>}
                  <button className={styles.primaryBtn} type="submit" disabled={loading}>
                    {loading ? <Spinner size={20} color="#fff" /> : 'Enviar link'}
                  </button>
                </form>
              </>
            )}
            <button className={styles.link} onClick={() => { setMode('signin'); clearError(); setResetSent(false) }}>
              Voltar ao login
            </button>
          </>
        )}
      </div>

      <WavyDecor position="bottom" />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
