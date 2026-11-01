import type { Task, TaskDraft, TaskPriority, TaskStatus } from '@/types'
import { isTaskPriority, isTaskStatus } from '@/utils/labels'

export interface TaskFormValues {
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  estimateHours: string
  labels: string
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>

export function emptyTaskFormValues(projectId = ''): TaskFormValues {
  return {
    title: '',
    description: '',
    projectId,
    assigneeId: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimateHours: '4',
    labels: '',
  }
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    assigneeId: task.assigneeId,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    estimateHours: String(task.estimateHours),
    labels: task.labels.join(', '),
  }
}

export function parseLabels(value: string): string[] {
  return value
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean)
}

export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {}
  if (values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.'
  if (values.description.trim().length > 1000) errors.description = 'Description must be 1000 characters or fewer.'
  if (!values.projectId) errors.projectId = 'Select a project.'
  if (!values.assigneeId) errors.assigneeId = 'Select an assignee.'
  if (!isTaskStatus(values.status)) errors.status = 'Select a status.'
  if (!isTaskPriority(values.priority)) errors.priority = 'Select a priority.'
  if (!values.dueDate) errors.dueDate = 'Choose a due date.'
  const estimate = Number(values.estimateHours)
  if (values.estimateHours.trim() === '' || !Number.isFinite(estimate) || estimate < 0 || estimate > 80) {
    errors.estimateHours = 'Estimate must be between 0 and 80 hours.'
  }
  if (parseLabels(values.labels).length > 8) errors.labels = 'Add up to 8 labels.'
  return errors
}

export function toTaskDraft(values: TaskFormValues): TaskDraft {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    projectId: values.projectId,
    assigneeId: values.assigneeId,
    status: values.status,
    priority: values.priority,
    dueDate: values.dueDate,
    estimateHours: Number(values.estimateHours),
    labels: parseLabels(values.labels),
  }
}

export function taskToDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    assigneeId: task.assigneeId,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    estimateHours: task.estimateHours,
    labels: [...task.labels],
  }
}
