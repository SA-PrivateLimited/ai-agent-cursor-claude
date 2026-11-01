import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

function IconBase({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  )
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  )
}

export function ProjectsIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
    </IconBase>
  )
}

export function TasksIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconBase>
  )
}

export function TeamIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="9" cy="9" r="3" />
      <path d="M4 19c.6-2.6 2.6-4 5-4s4.4 1.4 5 4" />
      <circle cx="17" cy="10" r="2.2" />
      <path d="M16 15.2c1.8.2 3.2 1.3 3.8 3.3" />
    </IconBase>
  )
}
