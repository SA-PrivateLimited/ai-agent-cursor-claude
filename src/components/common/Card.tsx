import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'
import styles from './Card.module.css'

export interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: ReactNode
  padding?: 'none' | 'md'
  className?: string
}

export function Card({ children, title, subtitle, action, padding = 'md', className }: CardProps) {
  return (
    <section className={cx(styles.card, styles[padding], className)}>
      {title ? (
        <div className={cx(styles.header, padding === 'none' && styles.headerFlush)}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}
