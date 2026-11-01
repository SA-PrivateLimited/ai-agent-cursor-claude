import { describe, expect, it } from 'vitest'
import { validateTaskForm, emptyTaskFormValues } from './taskForm'

describe('validateTaskForm', () => {
  it('requires a title, project, assignee, and due date', () => {
    expect(validateTaskForm(emptyTaskFormValues())).toMatchObject({
      title: 'Title must be at least 3 characters.',
      projectId: 'Select a project.',
      assigneeId: 'Select an assignee.',
      dueDate: 'Choose a due date.',
    })
  })

  it('accepts a complete draft', () => {
    expect(
      validateTaskForm({
        ...emptyTaskFormValues('prj_web'),
        title: 'Schedule launch retro',
        assigneeId: 'usr_elena',
        dueDate: '2026-11-19',
      }),
    ).toEqual({})
  })
})
