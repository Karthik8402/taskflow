import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { AlertCircle, Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 space-y-4">
      <div className="w-14 h-14 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-1 max-w-md">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Page Not Found (404)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The route you requested does not exist or may have been moved.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary" size="sm">
          <Home size={16} />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
    </div>
  )
}
