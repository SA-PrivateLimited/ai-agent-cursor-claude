import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { ProjectListPage } from '@/features/projects/ProjectListPage'
import { TaskDetailPage } from '@/features/tasks/TaskDetailPage'
import { TaskFormPage } from '@/features/tasks/TaskFormPage'
import { TaskListPage } from '@/features/tasks/TaskListPage'
import { TeamPage } from '@/features/team/TeamPage'
import { NotFoundPage } from './NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'projects', element: <ProjectListPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      { path: 'tasks', element: <TaskListPage /> },
      { path: 'tasks/new', element: <TaskFormPage /> },
      { path: 'tasks/:taskId', element: <TaskDetailPage /> },
      { path: 'tasks/:taskId/edit', element: <TaskFormPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
