import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../../types'
import { format, isPast, isToday } from 'date-fns'
import {
  GripVertical,
  Check,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  AlertCircle,
  MoreVertical,
  Tag,
  Sparkles,
} from 'lucide-react'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const priorityColors = {
    high: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
    },
    medium: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500',
    },
    low: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
  }

  const categoryIcons = {
    daily: Clock,
    weekly: Calendar,
    monthly: Sparkles,
  }

  const CategoryIcon = categoryIcons[todo.category] || Clock

  const isOverdue =
    todo.due_date &&
    !todo.completed &&
    isPast(new Date(todo.due_date)) &&
    !isToday(new Date(todo.due_date))

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group glass-card rounded-2xl p-4 transition-all duration-200 border ${
        todo.completed
          ? 'opacity-70 bg-gray-50/50 dark:bg-gray-900/30 border-gray-200/40 dark:border-gray-800/40'
          : 'border-gray-200/80 dark:border-gray-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0 mt-0.5"
          aria-label="Drag to reorder task"
        >
          <GripVertical size={18} />
        </button>

        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 mt-0.5 ${
            todo.completed
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-gray-800'
          }`}
          aria-label={todo.completed ? 'Mark task incomplete' : 'Mark task completed'}
        >
          {todo.completed && <Check size={14} className="stroke-[3] animate-checkmark" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-semibold tracking-tight transition-all ${
                todo.completed
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {todo.title}
            </h3>

            {/* Actions Menu Trigger */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Task options"
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-36 glass-card rounded-xl p-1 z-40 shadow-xl border border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onEdit(todo)
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit Task</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onDelete(todo.id)
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {todo.description && (
            <p
              className={`text-xs line-clamp-2 ${
                todo.completed
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Badges Footer */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium">
            {/* Category Pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
              <CategoryIcon size={12} />
              <span>{todo.category}</span>
            </span>

            {/* Priority Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border capitalize font-semibold ${
                priorityColors[todo.priority].bg
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityColors[todo.priority].dot}`} />
              <span>{todo.priority} priority</span>
            </span>

            {/* Due Date Badge */}
            {todo.due_date && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                  isOverdue
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                <span>
                  {isOverdue ? 'Overdue: ' : 'Due: '}
                  {format(new Date(todo.due_date), 'MMM d, yyyy')}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
