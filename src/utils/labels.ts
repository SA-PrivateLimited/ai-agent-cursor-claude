import type { ProjectStatus, TaskPriority, TaskStatus } from '@/types'

export const TASK_STATUS_VALUES = ['todo', 'in_progress', 'in_review', 'done'] as const satisfies readonly TaskStatus[]

export const TASK_PRIORITY_VALUES = ['low', 'medium', 'high', 'urgent'] as const satisfies readonly TaskPriority[]

export const PROJECT_STATUS_VALUES = ['active', 'on_hold', 'completed', 'archived'] as const satisfies readonly ProjectStatus[]

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  in_review: 'In review',
  done: 'Done',
}

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  active: 'Active',
  on_hold: 'On hold',
  completed: 'Completed',
  archived: 'Archived',
}

export const TASK_STATUS_RANK: Record<TaskStatus, number> = {
  todo: 1,
  in_progress: 2,
  in_review: 3,
  done: 4,
}

export const TASK_PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUS_VALUES as readonly string[]).includes(value)
}

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITY_VALUES as readonly string[]).includes(value)
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUS_VALUES as readonly string[]).includes(value)
}
