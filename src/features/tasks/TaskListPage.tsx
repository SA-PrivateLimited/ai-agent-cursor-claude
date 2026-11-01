import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '@/app/routes'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Select } from '@/components/forms/Select'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import type { Task } from '@/types'
import { PAGE_SIZE } from '@/utils/constants'
import { formatDate } from '@/utils/format'
import { memberName, projectName } from '@/utils/lookups'
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_VALUES, TASK_STATUS_LABEL, TASK_STATUS_VALUES } from '@/utils/labels'
import { paginate } from '@/utils/paginate'
import { withSearchParams } from '@/utils/searchParams'
import layout from '@/styles/layout.module.css'
import { TaskPriorityBadge, TaskStatusBadge } from './TaskBadges'
import { filterTasks, readTaskFilters, sortTasks, type TaskFilterValues } from './taskFilters'
import styles from './tasks.module.css'

function hasActiveFilters(filters: TaskFilterValues): boolean {
  return Boolean(filters.q || filters.status || filters.priority || filters.projectId || filters.assigneeId)
}

export function TaskListPage() {
  useDocumentTitle('Tasks')
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const filters = readTaskFilters(params)
  const filtered = useMemo(
    () =>
      sortTasks(filterTasks(tasks.items, filters), filters.sort, filters.direction, (id) =>
        memberName(team.items, id),
      ),
    [filters, tasks.items, team.items],
  )
  const requestedPage = Number(params.get('page') ?? '1')
  const paged = paginate(filtered, requestedPage, PAGE_SIZE)

  function update(patch: Record<string, string | null>, resetPage = false) {
    setParams(withSearchParams(params, patch, resetPage))
  }

  const columns: Column<Task>[] = [
    {
      id: 'title',
      header: 'Task',
      sortable: true,
      cell: (task) => (
        <div className={styles.taskCell}>
          <Link className={styles.taskLink} to={routes.task(task.id)}>
            {task.title}
          </Link>
          <span className={styles.key}>{task.key}</span>
        </div>
      ),
    },
    { id: 'project', header: 'Project', cell: (task) => projectName(projects.items, task.projectId) },
    {
      id: 'assignee',
      header: 'Assignee',
      sortable: true,
      cell: (task) => memberName(team.items, task.assigneeId),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (task) => <TaskStatusBadge status={task.status} />,
    },
    {
      id: 'priority',
      header: 'Priority',
      sortable: true,
      cell: (task) => <TaskPriorityBadge priority={task.priority} />,
    },
    { id: 'dueDate', header: 'Due', sortable: true, cell: (task) => formatDate(task.dueDate) },
    { id: 'updatedAt', header: 'Updated', sortable: true, cell: (task) => formatDate(task.updatedAt) },
  ]

  return (
    <WorkspaceBoundary
      requirements={[projects, tasks, team]}
      loadingLabel="Loading tasks"
      fallbackError="Unable to load tasks."
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
          title="Tasks"
          description="Search, filter, and update work across every project."
          actions={<Button onClick={() => navigate(routes.newTask)}>New task</Button>}
        />
        <Card padding="none">
          <div className={layout.toolbar}>
            <SearchInput
              className={layout.search}
              value={filters.q}
              placeholder="Title, key, or label"
              onChange={(value) => update({ q: value }, true)}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(event) => update({ status: event.target.value }, true)}
              options={[
                { value: '', label: 'All statuses' },
                ...TASK_STATUS_VALUES.map((status) => ({ value: status, label: TASK_STATUS_LABEL[status] })),
              ]}
            />
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(event) => update({ priority: event.target.value }, true)}
              options={[
                { value: '', label: 'All priorities' },
                ...TASK_PRIORITY_VALUES.map((priority) => ({ value: priority, label: TASK_PRIORITY_LABEL[priority] })),
              ]}
            />
            <Select
              label="Project"
              value={filters.projectId}
              onChange={(event) => update({ project: event.target.value }, true)}
              options={[
                { value: '', label: 'All projects' },
                ...projects.items.map((project) => ({ value: project.id, label: project.name })),
              ]}
            />
            <Select
              label="Assignee"
              value={filters.assigneeId}
              onChange={(event) => update({ assignee: event.target.value }, true)}
              options={[
                { value: '', label: 'All assignees' },
                ...team.items.map((member) => ({ value: member.id, label: member.name })),
              ]}
            />
            <Select
              label="Sort"
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value }, true)}
              options={[
                { value: 'updatedAt', label: 'Recently updated' },
                { value: 'dueDate', label: 'Due date' },
                { value: 'priority', label: 'Priority' },
                { value: 'status', label: 'Status' },
                { value: 'title', label: 'Title' },
                { value: 'assignee', label: 'Assignee' },
              ]}
            />
            <Select
              label="Direction"
              value={filters.direction}
              onChange={(event) => update({ dir: event.target.value }, true)}
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
            />
          </div>
          {paged.total === 0 ? (
            <EmptyState
              title={hasActiveFilters(filters) ? 'No tasks match these filters' : 'No tasks yet'}
              description={
                hasActiveFilters(filters)
                  ? 'Try a different search or clear the filters to see the full list.'
                  : 'Create a task to start tracking work.'
              }
              action={
                hasActiveFilters(filters) ? (
                  <Button variant="secondary" onClick={() => setParams(new URLSearchParams())}>
                    Clear filters
                  </Button>
                ) : (
                  <Button onClick={() => navigate(routes.newTask)}>New task</Button>
                )
              }
            />
          ) : (
            <DataTable
              caption="Tasks"
              columns={columns}
              rows={paged.items}
              getRowId={(task) => task.id}
              sort={{ columnId: filters.sort, direction: filters.direction }}
              onSortChange={(sort) => update({ sort: sort.columnId, dir: sort.direction }, true)}
            />
          )}
          {paged.total > 0 ? (
            <Pagination
              page={paged.page}
              pageSize={PAGE_SIZE}
              total={paged.total}
              onPageChange={(page) => update({ page: String(page) })}
            />
          ) : null}
        </Card>
      </div>
    </WorkspaceBoundary>
  )
}
