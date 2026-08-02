import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Bell } from 'lucide-react'

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Alerts"
        description="System alerts, task reminder notifications, and keep-alive updates."
      />
      <EmptyState
        title="Notifications Hub Coming Soon"
        description="Real-time web notifications and email digest reminders are currently under development."
        icon={<Bell size={28} />}
      />
    </div>
  )
}
