import { Badge, type BadgeTone } from '@/components/common/Badge'
import type { ProjectStatus } from '@/types'
import { PROJECT_STATUS_LABEL } from '@/utils/labels'

const TONE: Record<ProjectStatus, BadgeTone> = {
  active: 'accent',
  on_hold: 'warning',
  completed: 'success',
  archived: 'neutral',
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge tone={TONE[status]}>{PROJECT_STATUS_LABEL[status]}</Badge>
}
