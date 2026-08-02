import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useTodos } from '../useTodos'
import { AuthProvider } from '../../context/AuthContext'
import React from 'react'

// Mock Supabase — force guest/localStorage mode in tests
vi.mock('../../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    }),
    removeChannel: vi.fn(),
  },
}))

// Wrapper provides AuthContext required by useTodos
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AuthProvider, null, children)

describe('useTodos (guest/localStorage mode)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads sample todos on first visit (no localStorage)', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.todos.length).toBeGreaterThan(0)
  })

  it('addTodo — adds a new task to the list', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const initialCount = result.current.todos.length

    await act(async () => {
      await result.current.addTodo({
        title: 'Test Task',
        category: 'daily',
        priority: 'high',
        description: 'Test desc',
        due_date: null,
      })
    })

    expect(result.current.todos.length).toBe(initialCount + 1)
    expect(result.current.todos[0].title).toBe('Test Task')
  })

  it('toggleTodo — flips completed status', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const firstTodo = result.current.todos[0]
    const originalStatus = firstTodo.completed

    await act(async () => {
      await result.current.toggleTodo(firstTodo.id, !originalStatus)
    })

    const updated = result.current.todos.find(t => t.id === firstTodo.id)
    expect(updated?.completed).toBe(!originalStatus)
  })

  it('deleteTodo — removes a task from the list', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const firstTodo = result.current.todos[0]
    const countBefore = result.current.todos.length

    await act(async () => {
      await result.current.deleteTodo(firstTodo.id)
    })

    expect(result.current.todos.length).toBe(countBefore - 1)
    expect(result.current.todos.find(t => t.id === firstTodo.id)).toBeUndefined()
  })

  it('updateTodo — updates title correctly', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const firstTodo = result.current.todos[0]

    await act(async () => {
      await result.current.updateTodo(firstTodo.id, { title: 'Updated Title' })
    })

    const updated = result.current.todos.find(t => t.id === firstTodo.id)
    expect(updated?.title).toBe('Updated Title')
  })

  it('categoryFilter — filters todos by category', async () => {
    const { result } = renderHook(() => useTodos('daily'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    result.current.todos.forEach(t => {
      expect(t.category).toBe('daily')
    })
  })

  it('error state — starts as null', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
  })
})
