import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithStore } from '@/test-utils/render'
import { TaskListPage } from './TaskListPage'

const { getProjects, getTasks, getTeam } = vi.hoisted(() => ({
  getProjects: vi.fn(),
  getTasks: vi.fn(),
  getTeam: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  getProjects,
  getTasks,
  getTeam,
  createTask: vi.fn(),
  updateTask: vi.fn(),
  resetData: vi.fn(),
}))

describe('TaskListPage states', () => {
  beforeEach(() => {
    getProjects.mockReset()
    getTasks.mockReset()
    getTeam.mockReset()
  })

  it('shows a loading state while tasks are requested', () => {
    getProjects.mockReturnValue(new Promise(() => undefined))
    getTasks.mockReturnValue(new Promise(() => undefined))
    getTeam.mockReturnValue(new Promise(() => undefined))

    renderWithStore(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Loading tasks')
  })

  it('shows an error state and retries', async () => {
    const user = userEvent.setup()
    getProjects.mockResolvedValue([])
    getTeam.mockResolvedValue([])
    getTasks.mockRejectedValueOnce(new Error('Unable to load tasks.'))

    renderWithStore(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load tasks.')

    getTasks.mockResolvedValueOnce([])
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('No tasks yet')).toBeInTheDocument()
  })
})
