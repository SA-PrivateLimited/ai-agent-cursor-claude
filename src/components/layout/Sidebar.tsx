import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import { routes } from '@/app/routes'
import { cx } from '@/utils/cx'
import { DashboardIcon, ProjectsIcon, TasksIcon, TeamIcon } from './icons'
import styles from './Sidebar.module.css'

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

const items: Array<{
  to: string
  label: string
  end?: boolean
  icon: ComponentType<{ className?: string }>
}> = [
  { to: routes.dashboard, label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: routes.projects, label: 'Projects', icon: ProjectsIcon },
  { to: routes.tasks, label: 'Tasks', icon: TasksIcon },
  { to: routes.team, label: 'Team', icon: TeamIcon },
]

export function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <aside className={cx(styles.sidebar, open && styles.open)}>
      <NavLink to={routes.dashboard} className={styles.brand} onClick={onNavigate}>
        <span className={styles.mark} aria-hidden="true">
          T
        </span>
        TaskFlow
      </NavLink>
      <nav id="primary-navigation" className={styles.nav} aria-label="Primary">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cx(styles.link, isActive && styles.active)}
              onClick={onNavigate}
            >
              <Icon className={styles.icon} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
