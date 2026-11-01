import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { routes } from '@/app/routes'
import { WorkspaceBoundary } from '@/app/WorkspaceBoundary'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Input } from '@/components/forms/Input'
import { Select } from '@/components/forms/Select'
import { TextArea } from '@/components/forms/TextArea'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { retryFailedLoads, useWorkspaceData } from '@/hooks/useWorkspaceData'
import { clearTaskMutation, createTask, updateTask } from '@/store/slices/tasksSlice'
import { useAppSelector } from '@/store/hooks'
import type { Project, TeamMember } from '@/types'
import { isTaskPriority, isTaskStatus, TASK_PRIORITY_LABEL, TASK_PRIORITY_VALUES, TASK_STATUS_LABEL, TASK_STATUS_VALUES } from '@/utils/labels'
import layout from '@/styles/layout.module.css'
import { emptyTaskFormValues, taskToFormValues, toTaskDraft, validateTaskForm, type TaskFormValues } from './taskForm'
import styles from './tasks.module.css'

export function TaskFormPage() {
  const { taskId } = useParams()
  const [params] = useSearchParams()
  const isEdit = Boolean(taskId)
  const { projects, tasks, team, dispatch } = useWorkspaceData()
  const task = tasks.items.find((item) => item.id === taskId)
  useDocumentTitle(isEdit ? 'Edit task' : 'New task')

  return (
    <WorkspaceBoundary
      requirements={[projects, tasks, team]}
      loadingLabel="Loading task form"
      fallbackError="Unable to load the task form."
      onRetry={() =>
        retryFailedLoads(dispatch, {
          projects: projects.status,
          tasks: tasks.status,
          team: team.status,
        })
      }
    >
      {isEdit && !task ? (
        <EmptyState title="Task not found" description="This task cannot be edited because it is not in the workspace." />
      ) : (
        <TaskForm
          key={task?.id ?? `new-${params.get('project') ?? 'none'}`}
          mode={isEdit ? 'edit' : 'create'}
          taskId={task?.id}
          initialValues={task ? taskToFormValues(task) : emptyTaskFormValues(params.get('project') ?? '')}
          projects={projects.items}
          members={team.items}
        />
      )}
    </WorkspaceBoundary>
  )
}

function TaskForm({
  mode,
  taskId,
  initialValues,
  projects,
  members,
}: {
  mode: 'create' | 'edit'
  taskId?: string
  initialValues: TaskFormValues
  projects: Project[]
  members: TeamMember[]
}) {
  const navigate = useNavigate()
  const dispatch = useWorkspaceData().dispatch
  const mutationStatus = useAppSelector((state) => state.tasks.mutationStatus)
  const mutationError = useAppSelector((state) => state.tasks.mutationError)
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validateTaskForm(values) : {}

  useEffect(() => {
    dispatch(clearTaskMutation())
  }, [dispatch])

  function update<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateTaskForm(values)
    setSubmitted(true)
    if (Object.keys(nextErrors).length > 0) return
    const draft = toTaskDraft(values)
    try {
      const saved =
        mode === 'edit' && taskId
          ? await dispatch(updateTask({ id: taskId, changes: draft })).unwrap()
          : await dispatch(createTask(draft)).unwrap()
      navigate(routes.task(saved.id))
    } catch {
      // The slice records mutationError for the alert below.
    }
  }

  return (
    <div className={layout.page}>
      <PageHeader
        title={mode === 'edit' ? 'Edit task' : 'New task'}
        description={mode === 'edit' ? 'Update the task details and save your changes.' : 'Add a task to a project and assign an owner.'}
        breadcrumbs={[
          { label: 'Tasks', to: routes.tasks },
          { label: mode === 'edit' ? 'Edit' : 'New' },
        ]}
      />
      <Card>
        <form onSubmit={onSubmit} className={layout.formGrid}>
          <Input
            className={layout.span}
            label="Title"
            value={values.title}
            error={errors.title}
            onChange={(event) => update('title', event.target.value)}
          />
          <TextArea
            className={layout.span}
            label="Description"
            value={values.description}
            error={errors.description}
            onChange={(event) => update('description', event.target.value)}
          />
          <Select
            label="Project"
            value={values.projectId}
            error={errors.projectId}
            onChange={(event) => update('projectId', event.target.value)}
            options={[{ value: '', label: 'Select a project' }, ...projects.map((project) => ({ value: project.id, label: project.name }))]}
          />
          <Select
            label="Assignee"
            value={values.assigneeId}
            error={errors.assigneeId}
            onChange={(event) => update('assigneeId', event.target.value)}
            options={[{ value: '', label: 'Select an assignee' }, ...members.map((member) => ({ value: member.id, label: member.name }))]}
          />
          <Select
            label="Status"
            value={values.status}
            error={errors.status}
            onChange={(event) => {
              if (isTaskStatus(event.target.value)) update('status', event.target.value)
            }}
            options={TASK_STATUS_VALUES.map((status) => ({ value: status, label: TASK_STATUS_LABEL[status] }))}
          />
          <Select
            label="Priority"
            value={values.priority}
            error={errors.priority}
            onChange={(event) => {
              if (isTaskPriority(event.target.value)) update('priority', event.target.value)
            }}
            options={TASK_PRIORITY_VALUES.map((priority) => ({ value: priority, label: TASK_PRIORITY_LABEL[priority] }))}
          />
          <Input
            label="Due date"
            type="date"
            value={values.dueDate}
            error={errors.dueDate}
            onChange={(event) => update('dueDate', event.target.value)}
          />
          <Input
            label="Estimate (hours)"
            type="number"
            min={0}
            max={80}
            step={1}
            value={values.estimateHours}
            error={errors.estimateHours}
            onChange={(event) => update('estimateHours', event.target.value)}
          />
          <Input
            className={layout.span}
            label="Labels"
            hint="Comma-separated, up to 8."
            value={values.labels}
            error={errors.labels}
            onChange={(event) => update('labels', event.target.value)}
          />
          {mutationError ? (
            <p className={`${styles.formError} ${layout.span}`} role="alert">
              {mutationError}
            </p>
          ) : null}
          <div className={`${styles.actions} ${layout.span}`}>
            <Button type="submit" isLoading={mutationStatus === 'saving'}>
              {mode === 'edit' ? 'Save changes' : 'Create task'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(mode === 'edit' && taskId ? routes.task(taskId) : values.projectId ? routes.project(values.projectId) : routes.tasks)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
