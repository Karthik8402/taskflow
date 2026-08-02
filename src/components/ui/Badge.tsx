import type { HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'
  children: ReactNode
}

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-tight transition-colors'

  const variants = {
    default:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20',
    success:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    danger:
      'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20',
    outline:
      'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
