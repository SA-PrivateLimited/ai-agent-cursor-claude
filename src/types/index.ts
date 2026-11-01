export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived'

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SortDirection = 'asc' | 'desc'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  initials: string
}

export interface Project {
  id: string
  key: string
  name: string
  description: string
  status: ProjectStatus
  ownerId: string
  memberIds: string[]
  startDate: string
  targetDate: string
}

export interface Task {
  id: string
  key: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  reporterId: string
  dueDate: string
  createdAt: string
  updatedAt: string
  labels: string[]
  estimateHours: number
}

export interface TaskDraft {
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  estimateHours: number
  labels: string[]
}
