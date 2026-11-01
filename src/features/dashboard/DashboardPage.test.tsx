import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetData } from '@/services/api'
import { renderWithStore } from '@/test-utils/render'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  beforeEach(() => {
    resetData()
  })

  it('renders project statistics and recent work', async () => {
    renderWithStore(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Active projects').nextElementSibling).toHaveTextContent('3')
    expect(screen.getByText('Open tasks').nextElementSibling).toHaveTextContent('13')
    expect(screen.getByText('Overdue tasks').nextElementSibling).toHaveTextContent('2')
    expect(screen.getByText('Completed tasks').nextElementSibling).toHaveTextContent('5')
    expect(screen.getAllByRole('link', { name: 'Triage beta crash reports' }).length).toBeGreaterThan(0)
  })
})
