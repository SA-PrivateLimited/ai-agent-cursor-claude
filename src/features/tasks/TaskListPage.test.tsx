import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetData } from '@/services/api'
import { renderWithStore } from '@/test-utils/render'
import { TaskListPage } from './TaskListPage'

function renderTasks() {
  return renderWithStore(
    <MemoryRouter initialEntries={['/tasks']}>
      <TaskListPage />
    </MemoryRouter>,
  )
}

describe('TaskListPage', () => {
  beforeEach(() => {
    resetData()
  })

  it('searches and filters tasks', async () => {
    const user = userEvent.setup()
    renderTasks()

    expect(await screen.findByRole('link', { name: 'Triage beta crash reports' })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Search'), 'rounding')

    expect(screen.getByRole('link', { name: 'Fix tax rounding bug' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Triage beta crash reports' })).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search'))
    await user.selectOptions(screen.getByLabelText('Status'), 'done')

    expect(screen.getByRole('link', { name: 'Audit marketing page content' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Fix tax rounding bug' })).not.toBeInTheDocument()
  })

  it('shows an empty state and clears filters', async () => {
    const user = userEvent.setup()
    renderTasks()
    await screen.findByRole('heading', { name: 'Tasks' })

    await user.type(screen.getByLabelText('Search'), 'zzzz-no-match')
    expect(screen.getByText('No tasks match these filters')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(await screen.findByRole('link', { name: 'Triage beta crash reports' })).toBeInTheDocument()
  })

  it('sorts by priority and paginates the list', async () => {
    const user = userEvent.setup()
    renderTasks()
    await screen.findByRole('link', { name: 'Triage beta crash reports' })

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('link', { name: 'Specify invoice export' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Triage beta crash reports' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Priority' }))
    const priorityRows = screen.getAllByRole('row')
    expect(within(priorityRows[1]).getByRole('link')).toHaveTextContent('Write content migration notes')
  })
})
