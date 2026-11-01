export const routes = {
  dashboard: '/',
  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,
  tasks: '/tasks',
  newTask: '/tasks/new',
  task: (taskId: string) => `/tasks/${taskId}`,
  editTask: (taskId: string) => `/tasks/${taskId}/edit`,
  team: '/team',
} as const
