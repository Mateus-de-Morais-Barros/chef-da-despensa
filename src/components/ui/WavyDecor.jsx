import styles from './WavyDecor.module.css'

export default function WavyDecor({ position = 'bottom' }) {
  const isTop = position === 'top'

  // Both lean left (\): left side is higher on screen, right side lower.
  // Paths extend to x=-80 and x=510 to flow naturally off screen edges.
  // Top paths sit in the upper portion of the SVG; bottom in the lower portion.

  const outer    = isTop
    ? 'M-80 15 C40 -5, 100 55, 215 35 C330 15, 430 60, 510 75'
    : 'M-80 45 C40 25, 100 85, 215 65 C330 45, 430 90, 510 105'

  const middle   = isTop
    ? 'M-80 27 C40 7, 100 67, 215 47 C330 27, 430 72, 510 87'
    : 'M-80 57 C40 37, 100 97, 215 77 C330 57, 430 102, 510 117'

  const highlight = isTop
    ? 'M-80 35 C40 15, 100 75, 215 55 C330 35, 430 80, 510 95'
    : 'M-80 65 C40 45, 100 105, 215 85 C330 65, 430 110, 510 125'

  return (
    <div className={`${styles.wrapper} ${styles[position]}`}>
      <svg
        viewBox="0 0 430 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={styles.svg}
        style={{ overflow: 'visible' }}
      >
        <path d={outer}    stroke="#D4920A" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d={middle}   stroke="#E8A020" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d={highlight} stroke="#F5C842" strokeWidth="5"  strokeLinecap="round" fill="none" opacity="0.6" />
      </svg>
    </div>
  )
}
