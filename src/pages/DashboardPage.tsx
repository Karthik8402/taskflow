import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { DemoBanner } from '../components/Layout/DemoBanner'
import { StatsCard } from '../components/Dashboard/StatsCard'
import { ProgressRing } from '../components/Dashboard/ProgressRing'
import { TodoList } from '../components/Todos/TodoList'
import { TodoFilter } from '../components/Todos/TodoFilter'
import { TodoFormModal } from '../components/Todos/TodoFormModal'
import type { Todo, TodoPriority, StatusFilter } from '../types'
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react'

export function DashboardPage() {
  const { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos('all')

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Compute Stats
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
      t.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && t.completed) ||
      (statusFilter === 'pending' && !t.completed)

    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleCreateTask = async (data: {
    title: string
    description: string
    category: any
    priority: any
    due_date: string | null
  }) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, data)
    } else {
      await addTodo(data)
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
      {/* Demo Warning Banner */}
      <DemoBanner />

      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Productivity Dashboard</span>
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              Overview
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time monitoring of daily, weekly, and monthly tasks.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={total}
          subtitle="All active & completed"
          icon={ListTodo}
          colorClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          trend={`${total} total entries recorded`}
        />
        <StatsCard
          title="Completed"
          value={completed}
          subtitle={`${Math.round(completionPercentage)}% completed`}
          icon={CheckCircle}
          colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          trend={`${completed} tasks finished`}
        />
        <StatsCard
          title="Pending Focus"
          value={pending}
          subtitle="In progress"
          icon={Clock}
          colorClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
          trend={`${pending} items remaining`}
        />
        <StatsCard
          title="High Priority"
          value={highPriorityCount}
          subtitle="Needs attention"
          icon={AlertTriangle}
          colorClass="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          trend={highPriorityCount > 0 ? 'Urgent items pending' : 'No urgent alerts'}
        />
      </div>

      {/* Progress Rings Visual Overview */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-gray-200/80 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" />
            <span>Category Progress Metrics</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
            <ProgressRing
              percentage={dailyPct}
              size={120}
              strokeWidth={10}
              label="Daily"
              subtitle={`${dailyCompleted} of ${dailyTodos.length} done`}
            />
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
            <ProgressRing
              percentage={weeklyPct}
              size={120}
              strokeWidth={10}
              label="Weekly"
              subtitle={`${weeklyCompleted} of ${weeklyTodos.length} done`}
            />
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
            <ProgressRing
              percentage={monthlyPct}
              size={120}
              strokeWidth={10}
              label="Monthly"
              subtitle={`${monthlyCompleted} of ${monthlyTodos.length} done`}
            />
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
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

        {/* List & Drag Reorder */}
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-gray-500 animate-pulse">
            Loading tasks...
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
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
        onSubmit={handleCreateTask}
        initialData={editingTodo}
        defaultCategory="daily"
      />
    </div>
  )
}
