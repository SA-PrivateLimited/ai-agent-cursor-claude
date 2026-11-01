import { useEffect } from 'react'
import type { AppDispatch } from '@/app/store'
import { loadProjects } from '@/store/slices/projectsSlice'
import { loadTasks } from '@/store/slices/tasksSlice'
import { loadTeam } from '@/store/slices/teamSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { RequestStatus } from '@/types'

export function useWorkspaceData() {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((state) => state.projects)
  const tasks = useAppSelector((state) => state.tasks)
  const team = useAppSelector((state) => state.team)

  useEffect(() => {
    if (projects.status === 'idle') dispatch(loadProjects())
    if (tasks.status === 'idle') dispatch(loadTasks())
    if (team.status === 'idle') dispatch(loadTeam())
  }, [dispatch, projects.status, tasks.status, team.status])

  return { projects, tasks, team, dispatch }
}

export function workspaceView(
  parts: Array<{ status: RequestStatus }>,
): 'loading' | 'error' | 'ready' {
  const settled = parts.every((part) => part.status === 'succeeded' || part.status === 'failed')
  if (!settled) return 'loading'
  if (parts.some((part) => part.status === 'failed')) return 'error'
  return 'ready'
}

export function firstError(parts: Array<{ error: string | null }>, fallback: string): string {
  return parts.find((part) => part.error)?.error ?? fallback
}

export function retryFailedLoads(
  dispatch: AppDispatch,
  parts: { projects: RequestStatus; tasks: RequestStatus; team: RequestStatus },
): void {
  if (parts.projects === 'failed') dispatch(loadProjects())
  if (parts.tasks === 'failed') dispatch(loadTasks())
  if (parts.team === 'failed') dispatch(loadTeam())
}
