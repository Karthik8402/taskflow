import { useState, useEffect } from 'react'
import type { Todo, TodoCategory, TodoPriority } from '../../types'
import { X, Calendar, Clock, Sparkles, Tag, Plus, Check } from 'lucide-react'

interface TodoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: {
    title: string
    description: string
    category: TodoCategory
    priority: TodoPriority
    due_date: string | null
  }) => Promise<void>
  initialData?: Todo | null
  defaultCategory?: TodoCategory
}

export function TodoFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultCategory = 'daily',
}: TodoFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TodoCategory>(defaultCategory)
  const [priority, setPriority] = useState<TodoPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setCategory(initialData.category)
      setPriority(initialData.priority)
      setDueDate(
        initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : ''
      )
    } else {
      setTitle('')
      setDescription('')
      setCategory(defaultCategory)
      setPriority('medium')
      setDueDate('')
    }
    setFormError('')
  }, [initialData, defaultCategory, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setFormError('Task title is required.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      })
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save task'
      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const categoryOptions: { label: string; value: TodoCategory; icon: typeof Clock }[] = [
    { label: 'Daily Task', value: 'daily', icon: Clock },
    { label: 'Weekly Goal', value: 'weekly', icon: Calendar },
    { label: 'Monthly Milestone', value: 'monthly', icon: Sparkles },
  ]

  const priorityOptions: { label: string; value: TodoPriority; colorClass: string }[] = [
    { label: 'Low', value: 'low', colorClass: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
    { label: 'Medium', value: 'medium', colorClass: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10' },
    { label: 'High', value: 'high', colorClass: 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 z-50 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              {initialData ? <Tag size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {initialData ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {initialData ? 'Modify task properties and deadline' : 'Add a task to your monitoring board'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {formError}
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Description / Notes
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add extra context, links, or details (optional)..."
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Category Cycle
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map(opt => {
                const Icon = opt.icon
                const selected = category === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-indigo-400'
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map(opt => {
                const selected = priority === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer capitalize ${
                      selected
                        ? `${opt.colorClass} border-2 shadow-xs`
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Due Date Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
