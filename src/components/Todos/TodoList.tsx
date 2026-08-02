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
import { EmptyState } from '../ui/EmptyState'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
  onReorder: (reorderedTodos: Todo[]) => void
  onAddNew?: () => void
  emptyTitle?: string
  emptyMessage?: string
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  onAddNew,
  emptyTitle = 'No tasks found',
  emptyMessage = 'Add a new task to get started!',
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
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        actionLabel={onAddNew ? 'Create Task' : undefined}
        onAction={onAddNew}
      />
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
