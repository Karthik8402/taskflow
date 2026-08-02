import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { HelpCircle } from 'lucide-react'

export function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Documentation"
        description="Guides, keyboard shortcuts, and FAQ documentation."
      />
      <EmptyState
        title="Documentation Center Coming Soon"
        description="We are compiling keyboard shortcuts, workflow guides, and video tutorials. Check back soon!"
        icon={<HelpCircle size={28} />}
      />
    </div>
  )
}
