import type { ReactNode } from 'react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { firstError, workspaceView } from '@/hooks/useWorkspaceData'
import type { RequestStatus } from '@/types'

interface Requirement {
  status: RequestStatus
  error: string | null
}

interface WorkspaceBoundaryProps {
  requirements: Requirement[]
  loadingLabel: string
  fallbackError: string
  onRetry: () => void
  children: ReactNode
}

export function WorkspaceBoundary({
  requirements,
  loadingLabel,
  fallbackError,
  onRetry,
  children,
}: WorkspaceBoundaryProps) {
  const view = workspaceView(requirements)
  if (view === 'loading') return <LoadingState label={loadingLabel} />
  if (view === 'error') return <ErrorState message={firstError(requirements, fallbackError)} onRetry={onRetry} />
  return children
}
