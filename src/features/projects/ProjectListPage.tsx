import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { routes } from '@/app/routes'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { ProgressBar } from '@/components/common/ProgressBar'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Select } from '@/components/forms/Select'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import { PAGE_SIZE } from '@/utils/constants'
import { formatDate } from '@/utils/format'
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_VALUES } from '@/utils/labels'
import { memberName } from '@/utils/lookups'
import { paginate } from '@/utils/paginate'
import { withSearchParams } from '@/utils/searchParams'
import layout from '@/styles/layout.module.css'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { filterProjects, readProjectFilters, sortProjects, withProjectMetrics, type ProjectListItem } from './projectMetrics'
import styles from './projects.module.css'

export function ProjectListPage() {
  useDocumentTitle('Projects')
  const [params, setParams] = useSearchParams()
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const filters = readProjectFilters(params)
  const filtered = useMemo(() => {
    const withMetrics = withProjectMetrics(projects.items, tasks.items)
    return sortProjects(filterProjects(withMetrics, filters), filters.sort, filters.direction)
  }, [filters, projects.items, tasks.items])
  const paged = paginate(filtered, Number(params.get('page') ?? '1'), PAGE_SIZE)

  function update(patch: Record<string, string | null>, resetPage = false) {
    setParams(withSearchParams(params, patch, resetPage))
  }

  const columns: Column<ProjectListItem>[] = [
    {
      id: 'name',
      header: 'Project',
      cell: (project) => (
        <span>
          <Link className={styles.projectLink} to={routes.project(project.id)}>
            {project.name}
          </Link>
          <span className={styles.key}>{project.key}</span>
        </span>
      ),
    },
    { id: 'status', header: 'Status', cell: (project) => <ProjectStatusBadge status={project.status} /> },
    { id: 'owner', header: 'Owner', cell: (project) => memberName(team.items, project.ownerId) },
    {
      id: 'progress',
      header: 'Progress',
      cell: (project) => <ProgressBar value={project.progress} label={`${project.name} progress`} />,
    },
    { id: 'openTasks', header: 'Open tasks', cell: (project) => project.openTasks },
    { id: 'targetDate', header: 'Target', cell: (project) => formatDate(project.targetDate) },
  ]

  return (
    <WorkspaceBoundary
      requirements={[projects, tasks, team]}
      loadingLabel="Loading projects"
      fallbackError="Unable to load projects."
      onRetry={() =>
        retryFailedLoads(dispatch, {
          projects: projects.status,
          tasks: tasks.status,
          team: team.status,
        })
      }
    >
      <div className={layout.page}>
        <PageHeader title="Projects" description="Review delivery progress, owners, and target dates." />
        <Card padding="none">
          <div className={layout.toolbar}>
            <SearchInput
              className={layout.search}
              value={filters.q}
              placeholder="Name, key, or description"
              onChange={(value) => update({ q: value }, true)}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(event) => update({ status: event.target.value }, true)}
              options={[
                { value: '', label: 'All statuses' },
                ...PROJECT_STATUS_VALUES.map((status) => ({ value: status, label: PROJECT_STATUS_LABEL[status] })),
              ]}
            />
            <Select
              label="Sort"
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value }, true)}
              options={[
                { value: 'name', label: 'Name' },
                { value: 'targetDate', label: 'Target date' },
                { value: 'openTasks', label: 'Open tasks' },
              ]}
            />
            <Select
              label="Direction"
              value={filters.direction}
              onChange={(event) => update({ dir: event.target.value }, true)}
              options={[
                { value: 'asc', label: 'Ascending' },
                { value: 'desc', label: 'Descending' },
              ]}
            />
          </div>
          {paged.total === 0 ? (
            <EmptyState
              title="No projects match these filters"
              description="Try another search or clear the filters."
              action={
                <Button variant="secondary" onClick={() => setParams(new URLSearchParams())}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <DataTable caption="Projects" columns={columns} rows={paged.items} getRowId={(project) => project.id} />
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
