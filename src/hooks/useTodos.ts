import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Todo, TodoCategory, TodoInsert, TodoUpdate } from '../types'

const LOCAL_STORAGE_TODOS_KEY = 'taskflow_guest_todos_v1'

const SAMPLE_TODOS: Todo[] = [
  {
    id: 'sample-1',
    user_id: 'guest-demo-user-id',
    title: 'Review daily productivity dashboard metrics',
    description: 'Check active task counters and completion progress rings.',
    category: 'daily',
    priority: 'high',
    completed: false,
    due_date: new Date(Date.now() + 86400000).toISOString(),
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    user_id: 'guest-demo-user-id',
    title: 'Set up Supabase database schema & RLS policies',
    description: 'Execute the SQL script in SQL Editor to enable 24/7 cloud sync.',
    category: 'daily',
    priority: 'medium',
    completed: true,
    due_date: new Date().toISOString(),
    sort_order: 2,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    user_id: 'guest-demo-user-id',
    title: 'Weekly team sprint planning & roadmap review',
    description: 'Align task priorities and review upcoming milestones.',
    category: 'weekly',
    priority: 'high',
    completed: false,
    due_date: new Date(Date.now() + 4 * 86400000).toISOString(),
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    user_id: 'guest-demo-user-id',
    title: 'Deploy to Cloudflare Pages global CDN',
    description: 'Push repo to GitHub and connect Cloudflare Pages for instant 24/7 hosting.',
    category: 'weekly',
    priority: 'medium',
    completed: false,
    due_date: new Date(Date.now() + 6 * 86400000).toISOString(),
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sample-5',
    user_id: 'guest-demo-user-id',
    title: 'Monthly architecture audit & Supabase keep-alive check',
    description: 'Verify GitHub Actions keep-alive workflow pings the database every 5 days.',
    category: 'monthly',
    priority: 'low',
    completed: false,
    due_date: new Date(Date.now() + 20 * 86400000).toISOString(),
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useTodos(categoryFilter?: TodoCategory | 'all') {
  const { user, isGuest } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Local storage helper for guest mode
  const getGuestTodos = (): Todo[] => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)
      if (!saved) {
        localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(SAMPLE_TODOS))
        return SAMPLE_TODOS
      }
      return JSON.parse(saved)
    } catch {
      return SAMPLE_TODOS
    }
  }

  const saveGuestTodos = (newTodos: Todo[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(newTodos))
      setTodos(newTodos)
    } catch (err) {
      console.error('Failed to save to localStorage:', err)
    }
  }

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (isGuest || !isSupabaseConfigured || !user) {
      const guestTodos = getGuestTodos()
      setTodos(guestTodos)
      setLoading(false)
      return
    }

    try {
      let query = (supabase as any)
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setTodos(data || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching tasks'
      console.error('Supabase fetch error:', message)
      setError(message)
      // Fallback to guest mode array if database query fails
      setTodos(getGuestTodos())
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, isGuest, user])

  useEffect(() => {
    fetchTodos()

    if (!isGuest && isSupabaseConfigured && user) {
      const channelId = `todos-channel-${categoryFilter || 'all'}-${Date.now()}`
      const channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'todos',
            filter: categoryFilter && categoryFilter !== 'all' ? `category=eq.${categoryFilter}` : undefined,
          },
          () => {
            fetchTodos()
          }
        )

      channel.subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchTodos, categoryFilter, isGuest, user])

  const addTodo = async (todoData: Omit<TodoInsert, 'user_id'>) => {
    if (isGuest || !isSupabaseConfigured || !user) {
      const currentGuest = getGuestTodos()
      const newTodo: Todo = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: user?.id || 'guest-demo-user-id',
        title: todoData.title,
        description: todoData.description || '',
        category: todoData.category,
        priority: todoData.priority || 'medium',
        completed: false,
        due_date: todoData.due_date || null,
        sort_order: currentGuest.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      saveGuestTodos([newTodo, ...currentGuest])
      return newTodo
    }

    const { data, error } = await (supabase as any)
      .from('todos')
      .insert({
        ...todoData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    fetchTodos()
    return data
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    if (isGuest || !isSupabaseConfigured || !user) {
      const updated = getGuestTodos().map(t =>
        t.id === id ? { ...t, completed, updated_at: new Date().toISOString() } : t
      )
      saveGuestTodos(updated)
      return
    }

    const { error } = await (supabase as any)
      .from('todos')
      .update({ completed })
      .eq('id', id)

    if (error) throw error
    fetchTodos()
  }

  const updateTodo = async (id: string, updates: Partial<TodoUpdate>) => {
    if (isGuest || !isSupabaseConfigured || !user) {
      const updated = getGuestTodos().map(t =>
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
      )
      saveGuestTodos(updated)
      return
    }

    const { error } = await (supabase as any)
      .from('todos')
      .update(updates)
      .eq('id', id)

    if (error) throw error
    fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    if (isGuest || !isSupabaseConfigured || !user) {
      const updated = getGuestTodos().filter(t => t.id !== id)
      saveGuestTodos(updated)
      return
    }

    const { error } = await (supabase as any)
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) throw error
    fetchTodos()
  }

  const reorderTodos = async (reorderedList: Todo[]) => {
    setTodos(reorderedList)

    if (isGuest || !isSupabaseConfigured || !user) {
      const updatedList = reorderedList.map((item, index) => ({
        ...item,
        sort_order: index + 1,
      }))
      saveGuestTodos(updatedList)
      return
    }

    try {
      const updates = reorderedList.map((item, index) => ({
        id: item.id,
        sort_order: index + 1,
      }))

      for (const update of updates) {
        await (supabase as any)
          .from('todos')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      }
    } catch (err) {
      console.error('Failed to update sort order:', err)
      fetchTodos()
    }
  }

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    refetch: fetchTodos,
  }
}
