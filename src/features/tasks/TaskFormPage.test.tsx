import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetData } from '@/services/api'
import { renderWithStore } from '@/test-utils/render'
import { TaskDetailPage } from './TaskDetailPage'
import { TaskFormPage } from './TaskFormPage'

function renderTaskRoutes(initialEntry: string) {
  return renderWithStore(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:taskId/edit" element={<TaskFormPage />} />
        <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('task creation and editing', () => {
  beforeEach(() => {
    resetData()
  })

  it('requires the main fields before creating a task', async () => {
    const user = userEvent.setup()
    renderTaskRoutes('/tasks/new')

    await user.click(await screen.findByRole('button', { name: 'Create task' }))

    expect(screen.getByText('Title must be at least 3 characters.')).toBeInTheDocument()
    expect(screen.getByText('Select a project.')).toBeInTheDocument()
    expect(screen.getByText('Select an assignee.')).toBeInTheDocument()
    expect(screen.getByText('Choose a due date.')).toBeInTheDocument()
  })

  it('creates a task and shows it', async () => {
    const user = userEvent.setup()
    renderTaskRoutes('/tasks/new')

    await screen.findByRole('option', { name: 'Mobile App Launch' })
    await user.type(screen.getByLabelText('Title'), 'Schedule launch retro')
    await user.selectOptions(screen.getByLabelText('Project'), 'prj_mobile')
    await user.selectOptions(screen.getByLabelText('Assignee'), 'usr_elena')
    fireEvent.change(screen.getByLabelText('Due date'), { target: { value: '2026-11-19' } })
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByRole('heading', { name: 'Schedule launch retro' })).toBeInTheDocument()
    expect(screen.getAllByText('MOB-205').length).toBeGreaterThan(0)
  })

  it('edits an existing task title', async () => {
    const user = userEvent.setup()
    renderTaskRoutes('/tasks/tsk_001/edit')

    const title = await screen.findByLabelText('Title')
    expect(title).toHaveValue('Redesign navigation information architecture')
    await user.clear(title)
    await user.type(title, 'Redesign the navigation model')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByRole('heading', { name: 'Redesign the navigation model' })).toBeInTheDocument()
  })

  it('updates status from the task detail', async () => {
    const user = userEvent.setup()
    const { store } = renderTaskRoutes('/tasks/tsk_001')

    await screen.findByRole('heading', { name: 'Redesign navigation information architecture' })
    await user.selectOptions(screen.getByLabelText('Status'), 'done')

    await waitFor(() => {
      expect(store.getState().tasks.items.find((task) => task.id === 'tsk_001')?.status).toBe('done')
    })
    expect(screen.getByLabelText('Status')).toHaveValue('done')
  })
})
