import styles from './Spinner.module.css'

export default function Spinner({ size = 40, color = 'var(--color-primary)' }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size, borderTopColor: color }}
    />
  )
}
