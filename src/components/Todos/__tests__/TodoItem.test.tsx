import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoItem } from '../TodoItem'
import type { Todo } from '../../../types'

// Mock dnd-kit sortable hook
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

const sampleTodo: Todo = {
  id: 'todo-test-1',
  user_id: 'user-123',
  title: 'Complete high priority architectural audit',
  description: 'Inspect RLS policy definitions and API mutation signatures.',
  category: 'daily',
  priority: 'high',
  completed: false,
  due_date: new Date().toISOString(),
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('TodoItem component', () => {
  it('renders todo title and description', () => {
    render(
      <TodoItem
        todo={sampleTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    expect(screen.getByText('Complete high priority architectural audit')).toBeTruthy()
    expect(screen.getByText(/Inspect RLS policy definitions/)).toBeTruthy()
  })

  it('triggers onToggle when checkbox is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <TodoItem
        todo={sampleTodo}
        onToggle={handleToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    const checkbox = screen.getByLabelText('Mark task completed')
    fireEvent.click(checkbox)
    expect(handleToggle).toHaveBeenCalledWith('todo-test-1', true)
  })

  it('renders overflow options dropdown button', () => {
    render(
      <TodoItem
        todo={sampleTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    const optionsBtn = screen.getByLabelText('Task options')
    expect(optionsBtn).toBeTruthy()
  })
})
