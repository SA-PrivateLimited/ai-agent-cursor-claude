import { describe, expect, it } from 'vitest'
import { seedProjects, seedTasks } from '@/services/mock/data'
import { APP_TODAY } from '@/utils/constants'
import { getDashboardStats } from './dashboardStats'

describe('getDashboardStats', () => {
  it('keeps the seeded workload deterministic', () => {
    expect(getDashboardStats(seedProjects, seedTasks, APP_TODAY)).toEqual({
      activeProjects: 3,
      openTasks: 13,
      overdueTasks: 2,
      completedTasks: 5,
      tasksByStatus: {
        todo: 6,
        in_progress: 4,
        in_review: 3,
        done: 5,
      },
    })
  })
})
