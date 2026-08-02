import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  colorClass: string
  trend?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  trend,
}: StatsCardProps) {
  return (
    <div className="glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} shrink-0 shadow-sm`}>
          <Icon size={22} className="stroke-[2.2]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}
