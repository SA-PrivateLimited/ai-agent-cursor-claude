import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent'

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={cx(styles.badge, styles[tone])}>{children}</span>
}
