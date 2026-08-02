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
  Sparkles,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { DropdownMenu } from '../ui/DropdownMenu'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

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

  const priorityVariants = {
    high: 'danger',
    medium: 'warning',
    low: 'success',
  } as const

  const menuItems = [
    {
      label: 'Edit Task',
      icon: <Edit2 size={13} />,
      onClick: () => onEdit(todo),
    },
    {
      label: 'Delete Task',
      icon: <Trash2 size={13} />,
      variant: 'danger' as const,
      onClick: () => setConfirmDeleteOpen(true),
    },
  ]

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group p-4 bg-white dark:bg-slate-900 border rounded-lg transition-all duration-150 ${
          todo.completed
            ? 'opacity-70 border-slate-200/60 dark:border-slate-800/60'
            : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/30 shadow-xs'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0 mt-0.5"
            aria-label="Drag to reorder task"
          >
            <GripVertical size={18} />
          </button>

          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id, !todo.completed)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
              todo.completed
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-800'
            }`}
            aria-label={todo.completed ? 'Mark task incomplete' : 'Mark task completed'}
          >
            {todo.completed && <Check size={14} className="stroke-[3]" />}
          </button>

          {/* Task Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-sm font-semibold tracking-tight ${
                  todo.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {todo.title}
              </h3>

              {/* Overflow Actions */}
              <DropdownMenu
                align="right"
                trigger={
                  <button
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Task options"
                  >
                    <MoreVertical size={16} />
                  </button>
                }
                items={menuItems}
              />
            </div>

            {todo.description && (
              <p
                className={`text-xs leading-relaxed line-clamp-2 ${
                  todo.completed
                    ? 'text-slate-400 dark:text-slate-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {todo.description}
              </p>
            )}

            {/* Badges Footer */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium">
              {/* Category */}
              <Badge variant="default">
                <CategoryIcon size={12} />
                <span className="capitalize">{todo.category}</span>
              </Badge>

              {/* Priority */}
              <Badge variant={priorityVariants[todo.priority]}>
                <span className="capitalize">{todo.priority} priority</span>
              </Badge>

              {/* Due Date */}
              {todo.due_date && (
                <Badge variant={isOverdue ? 'danger' : 'default'}>
                  {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                  <span>
                    {isOverdue ? 'Overdue: ' : 'Due: '}
                    {format(new Date(todo.due_date), 'MMM d, yyyy')}
                  </span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(todo.id)}
        title="Delete task?"
        description={`Are you sure you want to delete "${todo.title}"? This task cannot be recovered.`}
        confirmText="Delete Task"
      />
    </>
  )
}
