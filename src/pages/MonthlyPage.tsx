import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { DemoBanner } from '../components/Layout/DemoBanner'
import { TodoList } from '../components/Todos/TodoList'
import { TodoFilter } from '../components/Todos/TodoFilter'
import { TodoFormModal } from '../components/Todos/TodoFormModal'
import { ProgressRing } from '../components/Dashboard/ProgressRing'
import type { Todo, TodoPriority, StatusFilter } from '../types'
import { Sparkles, Plus, CheckCircle, AlertTriangle } from 'lucide-react'

export function MonthlyPage() {
  const { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos('monthly')

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
      await addTodo({ ...data, category: 'monthly' })
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
            <Sparkles size={24} className="text-rose-600 dark:text-rose-400" />
            <span>Monthly Target Milestones</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Long-term goal monitoring and major project deadlines.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Monthly Target</span>
        </button>
      </div>

      {/* Banner Card */}
      <div className="glass-card p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center border border-gray-200/80 dark:border-gray-800">
        <div className="md:col-span-2 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
            <Sparkles size={14} />
            <span>Monthly Roadmap</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Long-Term Strategic Goals
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Monitor overarching objectives, learning targets, and monthly milestones to ensure consistent long-term progress.
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
            label="Monthly Done"
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
          Loading monthly milestones...
        </div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={handleEditClick}
          onReorder={reorderTodos}
          onAddNew={handleOpenNewModal}
          emptyMessage="No monthly milestones found. Add a target to start your monthly vision!"
        />
      )}

      {/* Modal Form */}
      <TodoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
        initialData={editingTodo}
        defaultCategory="monthly"
      />
    </div>
  )
}
