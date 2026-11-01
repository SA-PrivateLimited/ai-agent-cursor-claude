import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { ProgressBar } from '@/components/common/ProgressBar'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import { ProjectStatusBadge } from '@/features/projects/ProjectStatusBadge'
import { withProjectMetrics } from '@/features/projects/projectMetrics'
import { TaskPriorityBadge } from '@/features/tasks/TaskBadges'
import { sortTasks } from '@/features/tasks/taskFilters'
import type { Task } from '@/types'
import { APP_TODAY } from '@/utils/constants'
import { cx } from '@/utils/cx'
import { formatDate } from '@/utils/format'
import { memberName, projectName } from '@/utils/lookups'
import layout from '@/styles/layout.module.css'
import { getDashboardStats } from './dashboardStats'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  useDocumentTitle('Dashboard')
  const navigate = useNavigate()
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const requirements = [projects, tasks, team]

  const stats = useMemo(
    () => getDashboardStats(projects.items, tasks.items, APP_TODAY),
    [projects.items, tasks.items],
  )
  const projectRows = useMemo(() => withProjectMetrics(projects.items, tasks.items), [projects.items, tasks.items])
  const recent = useMemo(
    () => sortTasks(tasks.items, 'updatedAt', 'desc', (id) => memberName(team.items, id)).slice(0, 5),
    [tasks.items, team.items],
  )
  const upcoming = useMemo(
    () =>
      sortTasks(
        tasks.items.filter((task) => task.status !== 'done'),
        'dueDate',
        'asc',
        (id) => memberName(team.items, id),
      ).slice(0, 5),
    [tasks.items, team.items],
  )

  const recentColumns: Column<Task>[] = [
    {
      id: 'title',
      header: 'Task',
      cell: (task) => (
        <Link className={styles.taskLink} to={routes.task(task.id)}>
          {task.title}
        </Link>
      ),
    },
    { id: 'project', header: 'Project', cell: (task) => projectName(projects.items, task.projectId) },
    { id: 'priority', header: 'Priority', cell: (task) => <TaskPriorityBadge priority={task.priority} /> },
    { id: 'due', header: 'Due', cell: (task) => formatDate(task.dueDate) },
  ]

  const summary = [
    { label: 'Active projects', value: stats.activeProjects, hint: 'Currently in flight', danger: false },
    { label: 'Open tasks', value: stats.openTasks, hint: 'Not done yet', danger: false },
    { label: 'Overdue tasks', value: stats.overdueTasks, hint: 'Past the due date and still open', danger: stats.overdueTasks > 0 },
    { label: 'Completed tasks', value: stats.completedTasks, hint: 'Marked done', danger: false },
  ]

  return (
    <WorkspaceBoundary
      requirements={requirements}
      loadingLabel="Loading workspace"
      fallbackError="Unable to load the workspace."
      onRetry={() =>
        retryFailedLoads(dispatch, {
          projects: projects.status,
          tasks: tasks.status,
          team: team.status,
        })
      }
    >
      <div className={layout.page}>
        <PageHeader
          title="Dashboard"
          description="A snapshot of active projects, open work, and what is due next."
        />
        <section aria-label="Workspace summary">
          <dl className={styles.stats}>
            {summary.map((item) => (
              <div key={item.label} className={styles.stat}>
                <dt className={styles.label}>{item.label}</dt>
                <dd className={cx(styles.value, item.danger && styles.danger)}>{item.value}</dd>
                <p className={styles.hint}>{item.hint}</p>
              </div>
            ))}
          </dl>
        </section>
        <div className={layout.split}>
          <Card title="Tasks by status" subtitle={`${tasks.items.length} tasks in the workspace`}>
            <div className={styles.bar} aria-hidden="true">
              <span className={styles.todo} style={{ width: share(stats.tasksByStatus.todo, tasks.items.length) }} />
              <span className={styles.inProgress} style={{ width: share(stats.tasksByStatus.in_progress, tasks.items.length) }} />
              <span className={styles.inReview} style={{ width: share(stats.tasksByStatus.in_review, tasks.items.length) }} />
              <span className={styles.done} style={{ width: share(stats.tasksByStatus.done, tasks.items.length) }} />
            </div>
            <ul className={styles.legend}>
              <li>
                <span>To do</span>
                <span className={styles.count}>{stats.tasksByStatus.todo}</span>
              </li>
              <li>
                <span>In progress</span>
                <span className={styles.count}>{stats.tasksByStatus.in_progress}</span>
              </li>
              <li>
                <span>In review</span>
                <span className={styles.count}>{stats.tasksByStatus.in_review}</span>
              </li>
              <li>
                <span>Done</span>
                <span className={styles.count}>{stats.tasksByStatus.done}</span>
              </li>
            </ul>
          </Card>
          <Card title="Upcoming deadlines" subtitle="Open tasks, soonest due date first">
            <DataTable
              caption="Upcoming deadlines"
              columns={recentColumns}
              rows={upcoming}
              getRowId={(task) => task.id}
              emptyTitle="No open tasks"
              emptyDescription="Every task in the workspace is done."
            />
          </Card>
        </div>
        <Card
          title="Recently updated"
          action={
            <Button variant="ghost" onClick={() => navigate(routes.tasks)}>
              View all
            </Button>
          }
          padding="none"
        >
          <DataTable caption="Recently updated tasks" columns={recentColumns} rows={recent} getRowId={(task) => task.id} />
        </Card>
        <Card title="Projects" padding="none">
          <DataTable
            caption="Projects"
            rows={projectRows}
            getRowId={(project) => project.id}
            columns={[
              {
                id: 'name',
                header: 'Project',
                cell: (project) => (
                  <Link className={styles.taskLink} to={routes.project(project.id)}>
                    {project.name}
                  </Link>
                ),
              },
              { id: 'status', header: 'Status', cell: (project) => <ProjectStatusBadge status={project.status} /> },
              { id: 'progress', header: 'Progress', cell: (project) => <ProgressBar value={project.progress} label={`${project.name} progress`} /> },
              { id: 'open', header: 'Open', cell: (project) => project.openTasks },
            ]}
          />
        </Card>
      </div>
    </WorkspaceBoundary>
  )
}

function share(count: number, total: number): string {
  if (total === 0) return '0%'
  return `${(count / total) * 100}%`
}
