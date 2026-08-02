import { Search, X } from 'lucide-react'
import type { TodoPriority, StatusFilter } from '../../types'
import { Tabs } from '../ui/Tabs'

interface TodoFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  priorityFilter: TodoPriority | 'all'
  onPriorityChange: (priority: TodoPriority | 'all') => void
  statusFilter: StatusFilter
  onStatusChange: (status: StatusFilter) => void
}

export function TodoFilter({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
}: TodoFilterProps) {
  const statusOptions: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ]

  const priorityOptions: { label: string; value: TodoPriority | 'all' }[] = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' },
  ]

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-8 h-10 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority Select */}
        <div className="w-full sm:w-auto shrink-0">
          <select
            value={priorityFilter}
            onChange={e => onPriorityChange(e.target.value as TodoPriority | 'all')}
            className="w-full sm:w-auto h-10 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <Tabs options={statusOptions} activeTab={statusFilter} onChange={onStatusChange} />
    </div>
  )
}
