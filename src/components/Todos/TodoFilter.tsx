import { Search, X, Filter } from 'lucide-react'
import type { TodoPriority, StatusFilter } from '../../types'

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
  const statusOptions: { label: string; value: StatusFilter }[] = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ]

  const priorityOptions: { label: string; value: TodoPriority | 'all' }[] = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' },
  ]

  return (
    <div className="glass-card p-4 rounded-2xl space-y-3 border border-gray-200/80 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-9 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter size={15} className="text-gray-400 dark:text-gray-500 hidden sm:inline" />
          <select
            value={priorityFilter}
            onChange={e => onPriorityChange(e.target.value as TodoPriority | 'all')}
            className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
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
      <div className="flex items-center gap-1.5 p-1 bg-gray-100/70 dark:bg-gray-900/60 rounded-xl border border-gray-200/50 dark:border-gray-800/50 w-full sm:w-fit">
        {statusOptions.map(opt => {
          const active = statusFilter === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs shadow-black/5'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
