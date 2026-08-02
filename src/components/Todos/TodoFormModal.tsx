import { useState, useEffect } from 'react'
import type { Todo, TodoCategory, TodoPriority } from '../../types'
import { validateTaskInput, TASK_CONSTRAINTS } from '../../lib/validation'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { Clock, Calendar, Sparkles } from 'lucide-react'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateTaskInput({ title, description, category, priority })
    if (errors.length > 0) {
      setFormError(errors[0].message)
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
    { label: 'Monthly Target', value: 'monthly', icon: Sparkles },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Create New Task'}
      description={
        initialData ? 'Modify task details and deadline' : 'Add a task to your workspace'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && <Alert variant="error">{formError}</Alert>}

        {/* Title */}
        <Input
          label="Task Title"
          required
          maxLength={TASK_CONSTRAINTS.TITLE_MAX_LENGTH}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />

        {/* Description */}
        <Textarea
          label="Description / Notes"
          maxLength={TASK_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add extra context or notes (optional)..."
          rows={3}
        />

        {/* Category Choice */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                  className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                >
                  <Icon size={16} className="mb-1" />
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Priority Select */}
        <Select
          label="Priority Level"
          value={priority}
          onChange={e => setPriority(e.target.value as TodoPriority)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </Select>

        {/* Due Date */}
        <Input
          label="Due Date (Optional)"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={submitting}>
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
