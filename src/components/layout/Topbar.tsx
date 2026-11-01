import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { Avatar } from '@/components/common/Avatar'
import { useAppSelector } from '@/store/hooks'
import { CURRENT_USER_ID } from '@/utils/constants'
import styles from './Topbar.module.css'

interface TopbarProps {
  menuExpanded: boolean
  onMenuClick: () => void
}

export function Topbar({ menuExpanded, onMenuClick }: TopbarProps) {
  const navigate = useNavigate()
  const members = useAppSelector((state) => state.team.items)
  const current = members.find((member) => member.id === CURRENT_USER_ID)
  const [query, setQuery] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = query.trim()
    navigate(next ? `${routes.tasks}?q=${encodeURIComponent(next)}` : routes.tasks)
  }

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menu}
        aria-label="Open menu"
        aria-expanded={menuExpanded}
        aria-controls="primary-navigation"
        onClick={onMenuClick}
      >
        Menu
      </button>
      <form className={styles.search} role="search" onSubmit={onSubmit}>
        <input
          type="search"
          value={query}
          aria-label="Search tasks"
          placeholder="Search tasks"
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
      <div className={styles.user}>
        <Avatar name={current?.name ?? 'Alex Morgan'} initials={current?.initials ?? 'AM'} size="sm" />
        <div className={styles.identity}>
          <div className={styles.name}>{current?.name ?? 'Alex Morgan'}</div>
          <div className={styles.role}>{current?.role ?? 'Engineering Manager'}</div>
        </div>
      </div>
    </header>
  )
}
