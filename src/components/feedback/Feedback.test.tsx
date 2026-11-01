import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from '@/components/common/Badge'
import { Card } from '@/components/common/Card'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'

describe('feedback states', () => {
  it('renders an empty state action', () => {
    render(<EmptyState title="No tasks yet" description="Create a task to start tracking work." action={<button type="button">New task</button>} />)

    expect(screen.getByRole('status')).toHaveTextContent('No tasks yet')
    expect(screen.getByRole('button', { name: 'New task' })).toBeInTheDocument()
  })

  it('renders a loading status', () => {
    render(<LoadingState label="Loading tasks" />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading tasks')
  })

  it('retries from an error state', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorState message="Unable to load tasks." onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load tasks.')
    expect(onRetry).toHaveBeenCalledOnce()
  })
})

describe('display components', () => {
  it('renders a badge, card title, and page heading', () => {
    render(
      <MemoryRouter>
        <PageHeader title="Tasks" description="Track work." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Tasks' }]} />
        <Card title="Recent">
          <Badge tone="info">In progress</Badge>
        </Card>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveTextContent('Home')
    expect(screen.getByRole('heading', { level: 2, name: 'Recent' })).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
  })
})
