import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Todo } from '../../types'
import { TodoItem } from './TodoItem'
import { CheckCircle2, ListPlus } from 'lucide-react'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
  onReorder: (reorderedTodos: Todo[]) => void
  onAddNew?: () => void
  emptyMessage?: string
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  onAddNew,
  emptyMessage = 'No tasks found. Add a new task to get started!',
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(t => t.id === active.id)
      const newIndex = todos.findIndex(t => t.id === over.id)
      const newArray = arrayMove(todos, oldIndex, newIndex)
      onReorder(newArray)
    }
  }

  if (todos.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center space-y-4 border border-dashed border-gray-300 dark:border-gray-800">
        <div className="w-14 h-14 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 size={30} className="stroke-[1.75]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {emptyMessage}
          </p>
        </div>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <ListPlus size={16} />
            <span>Create Task</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
