import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  const navigate = useNavigate()

  return (
    <EmptyState
      title="Page not found"
      description="The page you requested is not part of TaskFlow."
      action={<Button onClick={() => navigate(routes.dashboard)}>Go to dashboard</Button>}
    />
  )
}
