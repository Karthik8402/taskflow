import { Loader2 } from 'lucide-react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function Spinner({ size = 'md', className = '', label = 'Loading...' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div role="status" aria-label={label} className="inline-flex items-center gap-2">
      <Loader2 className={`animate-spin text-blue-600 dark:text-blue-400 ${sizes[size]} ${className}`} />
      <span className="sr-only">{label}</span>
    </div>
  )
}
