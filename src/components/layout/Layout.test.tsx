import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { TaskListPage } from '@/features/tasks/TaskListPage'
import { resetData } from '@/services/api'
import { renderWithStore } from '@/test-utils/render'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

describe('Sidebar', () => {
  it('exposes the primary destinations', () => {
    render(
      <MemoryRouter>
        <Sidebar open={false} onNavigate={vi.fn()} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Tasks' })).toHaveAttribute('href', '/tasks')
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/team')
  })
})

describe('Topbar', () => {
  it('searches tasks from the header', async () => {
    resetData()
    const user = userEvent.setup()
    renderWithStore(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Topbar menuExpanded={false} onMenuClick={vi.fn()} />} />
          <Route path="/tasks" element={<TaskListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Search tasks'), 'beta{enter}')

    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Triage beta crash reports' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Fix tax rounding bug' })).not.toBeInTheDocument()
  })
})
