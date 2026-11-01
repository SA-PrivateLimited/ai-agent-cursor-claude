import type { ReactNode } from 'react'
import { Button } from '@/components/common/Button'
import styles from './states.module.css'

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  action?: ReactNode
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, action }: ErrorStateProps) {
  return (
    <div className={styles.panel} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
      {action}
    </div>
  )
}
