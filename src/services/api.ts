import type { Project, Task, TaskDraft, TeamMember } from '@/types'
import { CURRENT_USER_ID, SAVED_AT } from '@/utils/constants'
import { seedProjects, seedTasks, seedTeam } from '@/services/mock/data'

/**
 * Mock API boundary. Screens call these functions instead of importing seed data.
 * Task mutations stay in memory until `resetData` restores the deterministic seed.
 */

let tasks: Task[] = clone(seedTasks)

function clone<T>(value: T): T {
  return structuredClone(value)
}

function delay(): Promise<void> {
  const milliseconds = import.meta.env.MODE === 'test' ? 0 : 300
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

function assertDraft(draft: TaskDraft): void {
  if (draft.title.trim().length < 3) {
    throw new Error('Title must be at least 3 characters.')
  }
  if (!draft.dueDate) {
    throw new Error('Choose a due date.')
  }
  if (!seedTeam.some((member) => member.id === draft.assigneeId)) {
    throw new Error('Select a team member that exists.')
  }
  if (!Number.isFinite(draft.estimateHours) || draft.estimateHours < 0 || draft.estimateHours > 80) {
    throw new Error('Estimate must be between 0 and 80 hours.')
  }
}

function nextTaskKey(projectKey: string): string {
  const numbers = tasks
    .filter((task) => task.key.startsWith(`${projectKey}-`))
    .map((task) => Number(task.key.slice(projectKey.length + 1)))
    .filter((value) => Number.isFinite(value))
  const next = Math.max(0, ...numbers) + 1
  return `${projectKey}-${String(next).padStart(3, '0')}`
}

function nextTaskId(): string {
  const numbers = tasks
    .map((task) => Number(task.id.replace('tsk_', '')))
    .filter((value) => Number.isFinite(value))
  const next = Math.max(0, ...numbers) + 1
  return `tsk_${String(next).padStart(3, '0')}`
}

export function resetData(): void {
  tasks = clone(seedTasks)
}

export async function getProjects(): Promise<Project[]> {
  await delay()
  return clone(seedProjects)
}

export async function getTeam(): Promise<TeamMember[]> {
  await delay()
  return clone(seedTeam)
}

export async function getTasks(): Promise<Task[]> {
  await delay()
  return clone(tasks)
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  await delay()
  assertDraft(draft)
  const project = seedProjects.find((item) => item.id === draft.projectId)
  if (!project) throw new Error('Select a project that exists.')

  const created: Task = {
    id: nextTaskId(),
    key: nextTaskKey(project.key),
    projectId: draft.projectId,
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    priority: draft.priority,
    assigneeId: draft.assigneeId,
    reporterId: CURRENT_USER_ID,
    dueDate: draft.dueDate,
    createdAt: SAVED_AT,
    updatedAt: SAVED_AT,
    labels: [...draft.labels],
    estimateHours: draft.estimateHours,
  }
  tasks = [...tasks, created]
  return clone(created)
}

export async function updateTask(id: string, draft: TaskDraft): Promise<Task> {
  await delay()
  assertDraft(draft)
  const current = tasks.find((task) => task.id === id)
  if (!current) throw new Error('Task not found.')
  const project = seedProjects.find((item) => item.id === draft.projectId)
  if (!project) throw new Error('Select a project that exists.')

  const updated: Task = {
    ...current,
    projectId: draft.projectId,
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    priority: draft.priority,
    assigneeId: draft.assigneeId,
    dueDate: draft.dueDate,
    estimateHours: draft.estimateHours,
    labels: [...draft.labels],
    key: current.projectId === draft.projectId ? current.key : nextTaskKey(project.key),
    updatedAt: SAVED_AT,
  }
  tasks = tasks.map((task) => (task.id === id ? updated : task))
  return clone(updated)
}
