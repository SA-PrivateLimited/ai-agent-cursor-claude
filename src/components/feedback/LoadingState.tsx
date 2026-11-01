import styles from './states.module.css'

export interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p className={styles.title}>{label}</p>
    </div>
  )
}
