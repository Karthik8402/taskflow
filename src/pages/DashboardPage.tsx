import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressRing } from '../components/Dashboard/ProgressRing'
import { TodoList } from '../components/Todos/TodoList'
import { TodoFilter } from '../components/Todos/TodoFilter'
import { TodoFormModal } from '../components/Todos/TodoFormModal'
import { TaskListSkeleton } from '../components/ui/Skeleton'
import type { Todo, TodoCategory, TodoPriority, StatusFilter } from '../types'
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
} from 'lucide-react'

export function DashboardPage() {
  const { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos('all')
  const { success, error } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Compute Statistics
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const pending = total - completed
  const completionPercentage = total > 0 ? (completed / total) * 100 : 0

  const dailyTodos = todos.filter(t => t.category === 'daily')
  const dailyCompleted = dailyTodos.filter(t => t.completed).length
  const dailyPct = dailyTodos.length > 0 ? (dailyCompleted / dailyTodos.length) * 100 : 0

  const weeklyTodos = todos.filter(t => t.category === 'weekly')
  const weeklyCompleted = weeklyTodos.filter(t => t.completed).length
  const weeklyPct = weeklyTodos.length > 0 ? (weeklyCompleted / weeklyTodos.length) * 100 : 0

  const monthlyTodos = todos.filter(t => t.category === 'monthly')
  const monthlyCompleted = monthlyTodos.filter(t => t.completed).length
  const monthlyPct = monthlyTodos.length > 0 ? (monthlyCompleted / monthlyTodos.length) * 100 : 0

  const highPriorityCount = todos.filter(t => t.priority === 'high' && !t.completed).length

  // Filter Tasks
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
        await addTodo(data)
        success('New task created.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save task'
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
        title="Productivity Dashboard"
        description="Real-time monitoring of daily, weekly, and monthly task execution."
        action={
          <Button variant="primary" size="sm" onClick={handleOpenNewModal}>
            <Plus size={16} />
            <span>New Task</span>
          </Button>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Tasks
              </p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {total}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recorded tasks</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
              <ListTodo size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {completed}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round(completionPercentage)}% complete
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
              <CheckCircle2 size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Focus
              </p>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {pending}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Items in progress</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md">
              <Clock size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                High Priority
              </p>
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                {highPriorityCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Urgent items</p>
            </div>
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md">
              <AlertTriangle size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Rings Visual Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Category Progress Metrics</span>
          </CardTitle>
          <CardDescription>Visual completion rate across time horizons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <ProgressRing
                percentage={dailyPct}
                size={110}
                strokeWidth={9}
                gradientId="dailyGradient"
                label="Daily"
                subtitle={`${dailyCompleted} of ${dailyTodos.length}`}
              />
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <ProgressRing
                percentage={weeklyPct}
                size={110}
                strokeWidth={9}
                gradientId="weeklyGradient"
                label="Weekly"
                subtitle={`${weeklyCompleted} of ${weeklyTodos.length}`}
              />
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <ProgressRing
                percentage={monthlyPct}
                size={110}
                strokeWidth={9}
                gradientId="monthlyGradient"
                label="Monthly"
                subtitle={`${monthlyCompleted} of ${monthlyTodos.length}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            All Tasks ({filteredTodos.length})
          </h2>
        </div>

        {/* Filter Toolbar */}
        <TodoFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Task List & Loading Skeleton */}
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
          />
        )}
      </div>

      {/* Add / Edit Task Modal */}
      <TodoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTodo}
        defaultCategory="daily"
      />
    </div>
  )
}
