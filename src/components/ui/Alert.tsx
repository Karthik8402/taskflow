import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

export interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info'
  title?: string
  children: ReactNode
  className?: string
}

export function Alert({ variant = 'info', title, children, className = '' }: AlertProps) {
  const styles = {
    error: {
      bg: 'bg-red-500/10 dark:bg-red-500/15 border-red-500/20 text-red-700 dark:text-red-300',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20 text-amber-700 dark:text-amber-300',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20 text-blue-700 dark:text-blue-300',
      icon: Info,
    },
  }

  const { bg, icon: Icon } = styles[variant]

  return (
    <div className={`p-4 rounded-md border flex items-start gap-3 text-xs font-medium ${bg} ${className}`}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div className="space-y-0.5 min-w-0 flex-1">
        {title && <p className="font-bold text-xs">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
