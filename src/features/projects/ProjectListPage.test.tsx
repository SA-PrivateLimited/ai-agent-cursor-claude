import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetData } from '@/services/api'
import { renderWithStore } from '@/test-utils/render'
import { ProjectDetailPage } from './ProjectDetailPage'
import { ProjectListPage } from './ProjectListPage'

function renderProjects() {
  return renderWithStore(
    <MemoryRouter initialEntries={['/projects']}>
      <Routes>
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectListPage', () => {
  beforeEach(() => {
    resetData()
  })

  it('filters projects by search and opens a project', async () => {
    const user = userEvent.setup()
    renderProjects()

    expect(await screen.findByRole('link', { name: 'Website Redesign' })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Search'), 'billing')

    expect(screen.getByRole('link', { name: 'Billing Platform' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Website Redesign' })).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search'))
    await user.click(screen.getByRole('link', { name: 'Website Redesign' }))

    expect(await screen.findByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument()
    expect(screen.getAllByText(/winter campaign/).length).toBeGreaterThan(0)
  })
})
