import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Select } from '@/components/forms/Select'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import { withSearchParams } from '@/utils/searchParams'
import layout from '@/styles/layout.module.css'
import styles from './TeamPage.module.css'

export function TeamPage() {
  useDocumentTitle('Team')
  const [params, setParams] = useSearchParams()
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const query = params.get('q') ?? ''
  const department = params.get('department') ?? ''
  const departments = useMemo(
    () => Array.from(new Set(team.items.map((member) => member.department))).sort((a, b) => a.localeCompare(b)),
    [team.items],
  )
  const visible = team.items
    .filter((member) => {
      const haystack = `${member.name} ${member.email} ${member.role} ${member.department}`.toLowerCase()
      if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false
      if (department && member.department !== department) return false
      return true
    })
    .sort((left, right) => left.name.localeCompare(right.name))

  function update(patch: Record<string, string | null>) {
    setParams(withSearchParams(params, patch))
  }

  return (
    <WorkspaceBoundary
      requirements={[projects, tasks, team]}
      loadingLabel="Loading team"
      fallbackError="Unable to load the team."
      onRetry={() =>
        retryFailedLoads(dispatch, {
          projects: projects.status,
          tasks: tasks.status,
          team: team.status,
        })
      }
    >
      <div className={layout.page}>
        <PageHeader title="Team" description="People assigned across the current projects." />
        <Card padding="none">
          <div className={layout.toolbar}>
            <SearchInput
              className={layout.search}
              value={query}
              placeholder="Name, role, or email"
              onChange={(value) => update({ q: value })}
            />
            <Select
              label="Department"
              value={department}
              onChange={(event) => update({ department: event.target.value })}
              options={[{ value: '', label: 'All departments' }, ...departments.map((item) => ({ value: item, label: item }))]}
            />
          </div>
        </Card>
        {visible.length === 0 ? (
          <EmptyState
            title="No people match these filters"
            description="Try another name or department."
            action={
              <Button variant="secondary" onClick={() => setParams(new URLSearchParams())}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className={styles.grid}>
            {visible.map((member) => {
              const openTasks = tasks.items.filter((task) => task.assigneeId === member.id && task.status !== 'done').length
              return (
                <Card key={member.id}>
                  <div className={styles.person}>
                    <Avatar name={member.name} initials={member.initials} />
                    <div>
                      <h2 className={styles.name}>{member.name}</h2>
                      <p className={styles.role}>{member.role}</p>
                    </div>
                  </div>
                  <dl className={styles.facts}>
                    <div>
                      <dt>Department</dt>
                      <dd>{member.department}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{member.email}</dd>
                    </div>
                    <div>
                      <dt>Open tasks</dt>
                      <dd>{openTasks}</dd>
                    </div>
                  </dl>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </WorkspaceBoundary>
  )
}
