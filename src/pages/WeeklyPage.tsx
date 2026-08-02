import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { DemoBanner } from '../components/Layout/DemoBanner'
import { TodoList } from '../components/Todos/TodoList'
import { TodoFilter } from '../components/Todos/TodoFilter'
import { TodoFormModal } from '../components/Todos/TodoFormModal'
import { ProgressRing } from '../components/Dashboard/ProgressRing'
import type { Todo, TodoPriority, StatusFilter } from '../types'
import { Calendar, Plus, CheckCircle, AlertTriangle } from 'lucide-react'

export function WeeklyPage() {
  const { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos('weekly')

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const pending = total - completed
  const completionPercentage = total > 0 ? (completed / total) * 100 : 0
  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length

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
      await addTodo({ ...data, category: 'weekly' })
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
      <DemoBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar size={24} className="text-cyan-600 dark:text-cyan-400" />
            <span>Weekly Goals Monitoring</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track weekly milestones, projects, and deliverables.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Weekly Goal</span>
        </button>
      </div>

      {/* Banner Card */}
      <div className="glass-card p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center border border-gray-200/80 dark:border-gray-800">
        <div className="md:col-span-2 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
            <Calendar size={14} />
            <span>7-Day Sprint Focus</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Weekly Sprint Target
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Organize multi-day goals and team deliverables to stay on target throughout the week.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={15} />
              {completed} Completed
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={15} />
              {highPriority} High Priority
            </span>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <ProgressRing
            percentage={completionPercentage}
            size={130}
            strokeWidth={10}
            label="Weekly Done"
            subtitle={`${completed} / ${total}`}
          />
        </div>
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

      {/* Task List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-gray-500 animate-pulse">
          Loading weekly goals...
        </div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={handleEditClick}
          onReorder={reorderTodos}
          onAddNew={handleOpenNewModal}
          emptyMessage="No weekly goals found. Add a weekly goal to start tracking!"
        />
      )}

      {/* Modal Form */}
      <TodoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
        initialData={editingTodo}
        defaultCategory="weekly"
      />
    </div>
  )
}
