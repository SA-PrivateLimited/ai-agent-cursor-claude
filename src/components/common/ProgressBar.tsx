import styles from './ProgressBar.module.css'

export interface ProgressBarProps {
  value: number
  label?: string
}

export function ProgressBar({ value, label = 'Progress' }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, Math.round(value)))

  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className={styles.fill} style={{ width: `${safe}%` }} />
      </div>
      <span className={styles.value}>{safe}%</span>
    </div>
  )
}
