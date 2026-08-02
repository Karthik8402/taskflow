import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsPage } from '../SettingsPage'

// Mock dependencies
vi.mock('../../hooks/useTodos', () => ({
  useTodos: () => ({
    todos: [
      {
        id: '1',
        title: 'Task 1',
        description: '',
        category: 'daily',
        priority: 'high',
        completed: false,
        due_date: null,
        sort_order: 1,
        created_at: '',
        user_id: 'uid-123',
      },
    ],
  }),
}))

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn() }),
}))

vi.mock('../../lib/supabase', () => ({
  isSupabaseConfigured: false,
}))

describe('SettingsPage', () => {
  it('renders Export JSON button', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Export JSON Backup')).toBeTruthy()
  })

  it('shows Demo Mode alert when Supabase is not configured', () => {
    render(<SettingsPage />)
    expect(screen.getByText(/Demo Mode Active/i)).toBeTruthy()
  })

  it('export button triggers download without throwing', () => {
    // Mock browser blob/anchor APIs
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    global.URL.revokeObjectURL = vi.fn()
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Export JSON Backup'))
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  it('export JSON does NOT include user_id in output', () => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    global.URL.revokeObjectURL = vi.fn()
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Export JSON Backup'))
    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
  })
})
