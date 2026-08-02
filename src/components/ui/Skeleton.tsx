import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
}

export function Skeleton({ className = '', width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md ${className}`}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="w-5 h-5 rounded-md shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  )
}
