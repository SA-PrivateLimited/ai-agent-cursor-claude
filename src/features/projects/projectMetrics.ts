import type { Project, ProjectStatus, SortDirection, Task } from '@/types'
import { isProjectStatus } from '@/utils/labels'

export interface ProjectListItem extends Project {
  openTasks: number
  progress: number
}

export type ProjectSortKey = 'name' | 'targetDate' | 'openTasks'

export interface ProjectFilterValues {
  q: string
  status: ProjectStatus | ''
  sort: ProjectSortKey
  direction: SortDirection
}

const SORT_KEYS: readonly ProjectSortKey[] = ['name', 'targetDate', 'openTasks']

export function withProjectMetrics(projects: readonly Project[], tasks: readonly Task[]): ProjectListItem[] {
  return projects.map((project) => {
    const related = tasks.filter((task) => task.projectId === project.id)
    const done = related.filter((task) => task.status === 'done').length
    const progress = related.length === 0 ? 0 : Math.round((done / related.length) * 100)
    return { ...project, openTasks: related.length - done, progress }
  })
}

export function readProjectFilters(params: URLSearchParams): ProjectFilterValues {
  const status = params.get('status') ?? ''
  const sort = params.get('sort')
  const direction = params.get('dir')
  return {
    q: params.get('q') ?? '',
    status: isProjectStatus(status) ? status : '',
    sort: sort !== null && (SORT_KEYS as readonly string[]).includes(sort) ? (sort as ProjectSortKey) : 'name',
    direction: direction === 'desc' ? 'desc' : 'asc',
  }
}

export function filterProjects(projects: readonly ProjectListItem[], filters: ProjectFilterValues): ProjectListItem[] {
  const query = filters.q.trim().toLowerCase()
  return projects.filter((project) => {
    if (query) {
      const haystack = `${project.name} ${project.key} ${project.description}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (filters.status && project.status !== filters.status) return false
    return true
  })
}

export function sortProjects(
  projects: readonly ProjectListItem[],
  sort: ProjectSortKey,
  direction: SortDirection,
): ProjectListItem[] {
  const factor = direction === 'asc' ? 1 : -1
  return [...projects].sort((left, right) => {
    const primary =
      sort === 'name'
        ? left.name.localeCompare(right.name, 'en', { sensitivity: 'base' })
        : sort === 'targetDate'
          ? left.targetDate.localeCompare(right.targetDate)
          : left.openTasks - right.openTasks
    if (primary === 0) return left.id.localeCompare(right.id)
    return primary * factor
  })
}
