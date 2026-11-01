import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { SearchInput } from '@/components/common/SearchInput'
import { Input } from './Input'
import { Select } from './Select'
import { TextArea } from './TextArea'

describe('form fields', () => {
  it('shows an input error', () => {
    render(<Input label="Title" error="Title must be at least 3 characters." />)

    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Title must be at least 3 characters.')
  })

  it('renders select options', () => {
    render(
      <Select
        label="Status"
        defaultValue="todo"
        options={[
          { value: 'todo', label: 'To do' },
          { value: 'done', label: 'Done' },
        ]}
      />,
    )

    expect(screen.getByLabelText('Status')).toHaveValue('todo')
    expect(screen.getByRole('option', { name: 'Done' })).toBeInTheDocument()
  })

  it('collects a longer description', async () => {
    const user = userEvent.setup()
    render(<TextArea label="Description" />)

    await user.type(screen.getByLabelText('Description'), 'Ship the header')

    expect(screen.getByLabelText('Description')).toHaveValue('Ship the header')
  })

  it('clears a search query', async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = useState('beta')
      return <SearchInput value={value} onChange={setValue} />
    }
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByLabelText('Search')).toHaveValue('')
  })
})
