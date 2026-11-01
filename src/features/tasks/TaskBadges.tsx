import { Badge, type BadgeTone } from '@/components/common/Badge'
import type { TaskPriority, TaskStatus } from '@/types'
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from '@/utils/labels'

const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  todo: 'neutral',
  in_progress: 'info',
  in_review: 'warning',
  done: 'success',
}

const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{TASK_STATUS_LABEL[status]}</Badge>
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{TASK_PRIORITY_LABEL[priority]}</Badge>
}
