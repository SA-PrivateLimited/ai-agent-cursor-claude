import type { Project, Task, TaskStatus } from '@/types'
import { TASK_STATUS_VALUES } from '@/utils/labels'

export interface DashboardStats {
  activeProjects: number
  openTasks: number
  overdueTasks: number
  completedTasks: number
  tasksByStatus: Record<TaskStatus, number>
}

export function getDashboardStats(projects: readonly Project[], tasks: readonly Task[], today: string): DashboardStats {
  const tasksByStatus = Object.fromEntries(TASK_STATUS_VALUES.map((status) => [status, 0])) as Record<TaskStatus, number>
  for (const task of tasks) tasksByStatus[task.status] += 1

  return {
    activeProjects: projects.filter((project) => project.status === 'active').length,
    openTasks: tasks.filter((task) => task.status !== 'done').length,
    overdueTasks: tasks.filter((task) => task.status !== 'done' && task.dueDate < today).length,
    completedTasks: tasks.filter((task) => task.status === 'done').length,
    tasksByStatus,
  }
}
