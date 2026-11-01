import { Outlet } from 'react-router-dom'
import { closeSidebar, toggleSidebar } from '@/store/slices/uiSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import styles from './AppShell.module.css'

export function AppShell() {
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <Sidebar open={sidebarOpen} onNavigate={() => dispatch(closeSidebar())} />
      {sidebarOpen ? (
        <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => dispatch(closeSidebar())} />
      ) : null}
      <div className={styles.workspace}>
        <Topbar menuExpanded={sidebarOpen} onMenuClick={() => dispatch(toggleSidebar())} />
        <main id="main" className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
