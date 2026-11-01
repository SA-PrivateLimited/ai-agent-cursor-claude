import { describe, expect, it } from 'vitest'
import { seedTasks } from '@/services/mock/data'
import { filterTasks, sortTasks, type TaskFilterValues } from './taskFilters'

const baseFilters: TaskFilterValues = {
  q: '',
  status: '',
  priority: '',
  projectId: '',
  assigneeId: '',
  sort: 'updatedAt',
  direction: 'desc',
}

describe('task filters', () => {
  it('filters by query, status, priority, project, and assignee', () => {
    expect(filterTasks(seedTasks, { ...baseFilters, q: 'tax' }).map((task) => task.id)).toEqual(['tsk_010'])
    expect(filterTasks(seedTasks, { ...baseFilters, status: 'done' })).toHaveLength(5)
    expect(filterTasks(seedTasks, { ...baseFilters, priority: 'urgent' })).toHaveLength(2)
    expect(filterTasks(seedTasks, { ...baseFilters, projectId: 'prj_design' })).toHaveLength(3)
    expect(filterTasks(seedTasks, { ...baseFilters, assigneeId: 'usr_jordan' })).toHaveLength(3)
  })

  it('sorts titles ascending and keeps ids as a stable tie breaker', () => {
    const sorted = sortTasks(seedTasks, 'title', 'asc', () => '')
    expect(sorted[0]?.title).toBe('Audit marketing page content')
    expect(sorted.at(-1)?.title).toBe('Write content migration notes')

    const urgentFirst = sortTasks(seedTasks, 'priority', 'desc', () => '')
    expect(urgentFirst.slice(0, 2).map((task) => task.id)).toEqual(['tsk_005', 'tsk_010'])
  })
})
