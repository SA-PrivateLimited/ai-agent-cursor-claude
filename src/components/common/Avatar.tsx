import { cx } from '@/utils/cx'
import styles from './Avatar.module.css'

export interface AvatarProps {
  name: string
  initials: string
  size?: 'sm' | 'md'
}

export function Avatar({ name, initials, size = 'md' }: AvatarProps) {
  return (
    <span className={cx(styles.avatar, styles[size])} title={name} aria-hidden="true">
      {initials}
    </span>
  )
}
