import { Link, useNavigate, useParams } from 'react-router-dom'
import { routes } from '@/app/routes'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { ProgressBar } from '@/components/common/ProgressBar'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import { TaskPriorityBadge, TaskStatusBadge } from '@/features/tasks/TaskBadges'
import type { Task } from '@/types'
import { formatDate } from '@/utils/format'
import { memberName } from '@/utils/lookups'
import layout from '@/styles/layout.module.css'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { withProjectMetrics } from './projectMetrics'
import styles from './projects.module.css'

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const project = withProjectMetrics(projects.items, tasks.items).find((item) => item.id === projectId)
  const projectTasks = tasks.items.filter((task) => task.projectId === projectId)
  const members = team.items.filter((member) => project?.memberIds.includes(member.id))
  useDocumentTitle(project?.name ?? 'Project')

  const columns: Column<Task>[] = [
    {
      id: 'title',
      header: 'Task',
      cell: (task) => (
        <Link className={styles.projectLink} to={routes.task(task.id)}>
          {task.title}
        </Link>
      ),
    },
    { id: 'status', header: 'Status', cell: (task) => <TaskStatusBadge status={task.status} /> },
    { id: 'priority', header: 'Priority', cell: (task) => <TaskPriorityBadge priority={task.priority} /> },
    { id: 'assignee', header: 'Assignee', cell: (task) => memberName(team.items, task.assigneeId) },
    { id: 'due', header: 'Due', cell: (task) => formatDate(task.dueDate) },
  ]

  return (
    <WorkspaceBoundary
      requirements={[projects, tasks, team]}
      loadingLabel="Loading project"
      fallbackError="Unable to load this project."
      onRetry={() =>
        retryFailedLoads(dispatch, {
          projects: projects.status,
          tasks: tasks.status,
          team: team.status,
        })
      }
    >
      {!project ? (
        <EmptyState
          title="Project not found"
          description="This project is not in the workspace."
          action={<Button onClick={() => navigate(routes.projects)}>Back to projects</Button>}
        />
      ) : (
        <div className={layout.page}>
          <PageHeader
            title={project.name}
            description={project.description}
            breadcrumbs={[
              { label: 'Projects', to: routes.projects },
              { label: project.key },
            ]}
            actions={
              <Button onClick={() => navigate(`${routes.newTask}?project=${project.id}`)}>New task</Button>
            }
          />
          <div className={styles.meta}>
            <Card>
              <div className={styles.term}>Status</div>
              <ProjectStatusBadge status={project.status} />
            </Card>
            <Card>
              <div className={styles.term}>Owner</div>
              <div>{memberName(team.items, project.ownerId)}</div>
            </Card>
            <Card>
              <div className={styles.term}>Dates</div>
              <div>
                {formatDate(project.startDate)} – {formatDate(project.targetDate)}
              </div>
            </Card>
            <Card>
              <div className={styles.term}>Progress</div>
              <ProgressBar value={project.progress} label={`${project.name} progress`} />
            </Card>
          </div>
          <div className={layout.split}>
            <Card title="Team">
              <ul className={styles.members}>
                {members.map((member) => (
                  <li key={member.id} className={styles.member}>
                    <Avatar name={member.name} initials={member.initials} size="sm" />
                    <div>
                      <div>{member.name}</div>
                      <div className={styles.role}>{member.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Work">
              <div className={styles.meta}>
                <div>
                  <div className={styles.term}>Open</div>
                  <div>{project.openTasks}</div>
                </div>
                <div>
                  <div className={styles.term}>Total</div>
                  <div>{projectTasks.length}</div>
                </div>
              </div>
            </Card>
          </div>
          <Card title="Tasks" padding="none">
            {projectTasks.length === 0 ? (
              <EmptyState title="No tasks yet" description="Create the first task for this project." />
            ) : (
              <DataTable caption={`${project.name} tasks`} columns={columns} rows={projectTasks} getRowId={(task) => task.id} />
            )}
          </Card>
        </div>
      )}
    </WorkspaceBoundary>
  )
}
