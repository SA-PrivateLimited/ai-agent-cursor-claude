import type { SortDirection, Task, TaskPriority, TaskStatus } from '@/types'
import { isTaskPriority, isTaskStatus, TASK_PRIORITY_RANK, TASK_STATUS_RANK } from '@/utils/labels'

export type TaskSortKey = 'title' | 'priority' | 'status' | 'dueDate' | 'updatedAt' | 'assignee'

export interface TaskFilterValues {
  q: string
  status: TaskStatus | ''
  priority: TaskPriority | ''
  projectId: string
  assigneeId: string
  sort: TaskSortKey
  direction: SortDirection
}

const SORT_KEYS: readonly TaskSortKey[] = ['title', 'priority', 'status', 'dueDate', 'updatedAt', 'assignee']

export function isTaskSortKey(value: string | null): value is TaskSortKey {
  return value !== null && (SORT_KEYS as readonly string[]).includes(value)
}

export function readTaskFilters(params: URLSearchParams): TaskFilterValues {
  const status = params.get('status') ?? ''
  const priority = params.get('priority') ?? ''
  const sort = params.get('sort')
  const direction = params.get('dir')

  return {
    q: params.get('q') ?? '',
    status: isTaskStatus(status) ? status : '',
    priority: isTaskPriority(priority) ? priority : '',
    projectId: params.get('project') ?? '',
    assigneeId: params.get('assignee') ?? '',
    sort: isTaskSortKey(sort) ? sort : 'updatedAt',
    direction: direction === 'asc' ? 'asc' : 'desc',
  }
}

export function filterTasks(tasks: readonly Task[], filters: TaskFilterValues): Task[] {
  const query = filters.q.trim().toLowerCase()
  return tasks.filter((task) => {
    if (query) {
      const haystack = `${task.title} ${task.description} ${task.key} ${task.labels.join(' ')}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.projectId && task.projectId !== filters.projectId) return false
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false
    return true
  })
}

export function sortTasks(
  tasks: readonly Task[],
  sort: TaskSortKey,
  direction: SortDirection,
  getAssigneeName: (assigneeId: string) => string,
): Task[] {
  const factor = direction === 'asc' ? 1 : -1
  return [...tasks].sort((left, right) => {
    const primary = compareTasks(left, right, sort, getAssigneeName)
    if (primary === 0) return left.id.localeCompare(right.id)
    return primary * factor
  })
}

function compareTasks(
  left: Task,
  right: Task,
  sort: TaskSortKey,
  getAssigneeName: (assigneeId: string) => string,
): number {
  switch (sort) {
    case 'title':
      return left.title.localeCompare(right.title, 'en', { sensitivity: 'base' })
    case 'priority':
      return TASK_PRIORITY_RANK[left.priority] - TASK_PRIORITY_RANK[right.priority]
    case 'status':
      return TASK_STATUS_RANK[left.status] - TASK_STATUS_RANK[right.status]
    case 'dueDate':
      return left.dueDate.localeCompare(right.dueDate)
    case 'updatedAt':
      return left.updatedAt.localeCompare(right.updatedAt)
    case 'assignee':
      return getAssigneeName(left.assigneeId).localeCompare(getAssigneeName(right.assigneeId), 'en', {
        sensitivity: 'base',
      })
  }
}
