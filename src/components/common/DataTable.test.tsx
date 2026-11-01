import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTable } from './DataTable'
import { Pagination } from './Pagination'

describe('DataTable', () => {
  it('requests a sort when a column header is activated', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <DataTable
        caption="Example rows"
        rows={[
          { id: '1', name: 'Beta' },
          { id: '2', name: 'Alpha' },
        ]}
        getRowId={(row) => row.id}
        onSortChange={onSortChange}
        columns={[{ id: 'name', header: 'Name', sortable: true, cell: (row) => row.name }]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Name' }))

    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' })
    expect(screen.getByRole('table', { name: 'Example rows' })).toBeInTheDocument()
  })

  it('shows an empty state when there are no rows', () => {
    render(
      <DataTable
        caption="Example rows"
        rows={[]}
        getRowId={(row: { id: string }) => row.id}
        columns={[{ id: 'name', header: 'Name', cell: (row: { id: string }) => row.id }]}
        emptyTitle="No rows"
        emptyDescription="Nothing matched."
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('No rows')
    expect(screen.getByText('Nothing matched.')).toBeInTheDocument()
  })
})

describe('Pagination', () => {
  it('moves to the next page and disables the ends of the range', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageSize={8} total={18} onPageChange={onPageChange} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByText('1–8 of 18')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
