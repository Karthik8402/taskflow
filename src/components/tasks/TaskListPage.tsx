import { useState } from 'react'
import { useTodos } from '../../hooks/useTodos'
import { useToast } from '../../context/ToastContext'
import { PageHeader } from '../ui/PageHeader'
import { Button } from '../ui/Button'
import { TodoFilter } from '../Todos/TodoFilter'
import { TodoList } from '../Todos/TodoList'
import { TodoFormModal } from '../Todos/TodoFormModal'
import { TaskListSkeleton } from '../ui/Skeleton'
import type { Todo, TodoCategory, TodoPriority, StatusFilter } from '../../types'
import { Plus } from 'lucide-react'

export interface TaskListPageProps {
  category?: TodoCategory | 'all'
  title: string
  description?: string
}

export function TaskListPage({ category = 'all', title, description }: TaskListPageProps) {
  const { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos(category)
  const { success, error } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const filteredTodos = todos.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && t.completed) ||
      (statusFilter === 'pending' && !t.completed)

    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleCreateOrUpdateTask = async (data: {
    title: string
    description: string
    category: TodoCategory
    priority: TodoPriority
    due_date: string | null
  }) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, data)
        success('Task updated successfully.')
      } else {
        await addTodo({
          ...data,
          category: category !== 'all' ? category : data.category,
        })
        success('New task created.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed'
      error(msg)
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, completed)
      success(completed ? 'Task completed!' : 'Task marked pending.')
    } catch {
      error('Failed to update task status.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id)
      success('Task deleted.')
    } catch {
      error('Failed to delete task.')
    }
  }

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo)
    setModalOpen(true)
  }

  const handleOpenNewModal = () => {
    setEditingTodo(null)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button variant="primary" size="sm" onClick={handleOpenNewModal}>
            <Plus size={16} />
            <span>New Task</span>
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <TodoFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Task List / Skeleton */}
      {loading ? (
        <TaskListSkeleton />
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEditClick}
          onReorder={reorderTodos}
          onAddNew={handleOpenNewModal}
          emptyTitle={`No ${category !== 'all' ? category : ''} tasks found`}
          emptyMessage="Start by creating your first task using the button above."
        />
      )}

      {/* Task Form Modal */}
      <TodoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTodo}
        defaultCategory={category !== 'all' ? category : 'daily'}
      />
    </div>
  )
}
