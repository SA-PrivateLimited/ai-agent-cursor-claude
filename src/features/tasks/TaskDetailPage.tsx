import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { routes } from '@/app/routes'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Select } from '@/components/forms/Select'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import { updateTask } from '@/store/slices/tasksSlice'
import type { Task } from '@/types'
import { formatDate, formatDateTime } from '@/utils/format'
import { isTaskPriority, isTaskStatus, TASK_PRIORITY_LABEL, TASK_PRIORITY_VALUES, TASK_STATUS_LABEL, TASK_STATUS_VALUES } from '@/utils/labels'
import { memberName, projectName } from '@/utils/lookups'
import layout from '@/styles/layout.module.css'
import { TaskPriorityBadge, TaskStatusBadge } from './TaskBadges'
import { taskToDraft } from './taskForm'
import styles from './tasks.module.css'

export function TaskDetailPage() {
  const { taskId = '' } = useParams()
  const navigate = useNavigate()
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const task = tasks.items.find((item) => item.id === taskId)
  useDocumentTitle(task?.title ?? 'Task')

  function change(next: Partial<Pick<Task, 'status' | 'priority'>>) {
    if (!task) return
    dispatch(updateTask({ id: task.id, changes: { ...taskToDraft(task), ...next } }))
  }

  return (
    <WorkspaceBoundary
      requirements={[projects, tasks, team]}
      loadingLabel="Loading task"
      fallbackError="Unable to load this task."
      onRetry={() =>
        retryFailedLoads(dispatch, {
          projects: projects.status,
          tasks: tasks.status,
          team: team.status,
        })
      }
    >
      {!task ? (
        <EmptyState
          title="Task not found"
          description="This task is not in the workspace."
          action={<Button onClick={() => navigate(routes.tasks)}>Back to tasks</Button>}
        />
      ) : (
        <div className={layout.page}>
          <PageHeader
            title={task.title}
            description={task.description || 'No description yet.'}
            breadcrumbs={[
              { label: 'Tasks', to: routes.tasks },
              { label: task.key },
            ]}
            actions={<Button onClick={() => navigate(routes.editTask(task.id))}>Edit task</Button>}
          />
          <div className={styles.headerMeta}>
            <span className={styles.key}>{task.key}</span>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
          {tasks.mutationError ? <p className={styles.formError}>{tasks.mutationError}</p> : null}
          <Card title="Details">
            <div className={styles.meta}>
              <Select
                label="Status"
                value={task.status}
                disabled={tasks.mutationStatus === 'saving'}
                onChange={(event) => {
                  if (isTaskStatus(event.target.value)) change({ status: event.target.value })
                }}
                options={TASK_STATUS_VALUES.map((status) => ({ value: status, label: TASK_STATUS_LABEL[status] }))}
              />
              <Select
                label="Priority"
                value={task.priority}
                disabled={tasks.mutationStatus === 'saving'}
                onChange={(event) => {
                  if (isTaskPriority(event.target.value)) change({ priority: event.target.value })
                }}
                options={TASK_PRIORITY_VALUES.map((priority) => ({
                  value: priority,
                  label: TASK_PRIORITY_LABEL[priority],
                }))}
              />
              <Detail label="Project">
                <Link to={routes.project(task.projectId)}>{projectName(projects.items, task.projectId)}</Link>
              </Detail>
              <Detail label="Assignee">{memberName(team.items, task.assigneeId)}</Detail>
              <Detail label="Reporter">{memberName(team.items, task.reporterId)}</Detail>
              <Detail label="Due">{formatDate(task.dueDate)}</Detail>
              <Detail label="Estimate">{task.estimateHours}h</Detail>
              <Detail label="Updated">{formatDateTime(task.updatedAt)}</Detail>
              <Detail label="Labels">
                {task.labels.length === 0 ? (
                  'None'
                ) : (
                  <span className={styles.labels}>
                    {task.labels.map((label) => (
                      <Badge key={label}>{label}</Badge>
                    ))}
                  </span>
                )}
              </Detail>
            </div>
          </Card>
        </div>
      )}
    </WorkspaceBoundary>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className={styles.term}>{label}</div>
      <div>{children}</div>
    </div>
  )
}
