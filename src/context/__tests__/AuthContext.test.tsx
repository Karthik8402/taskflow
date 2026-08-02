import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import React from 'react'

vi.mock('../../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

// Helper component to read context values
function AuthConsumer() {
  const { user, isGuest, isLiveSupabase } = useAuth()
  return (
    <div>
      <span data-testid="user-email">{user?.email ?? 'no-user'}</span>
      <span data-testid="is-guest">{String(isGuest)}</span>
      <span data-testid="is-live">{String(isLiveSupabase)}</span>
    </div>
  )
}

function GuestToggle() {
  const { enableGuestMode, isGuest } = useAuth()
  return (
    <button onClick={enableGuestMode} data-testid="guest-btn">
      {isGuest ? 'is-guest' : 'not-guest'}
    </button>
  )
}

describe('AuthContext', () => {
  it('auto-enables guest mode when Supabase is not configured', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('is-guest').textContent).toBe('true')
    expect(screen.getByTestId('is-live').textContent).toBe('false')
  })

  it('guest user has demo email set', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('user-email').textContent).toBe('guest@taskflow.demo')
  })

  it('enableGuestMode sets isGuest to true', () => {
    render(
      <AuthProvider>
        <GuestToggle />
      </AuthProvider>
    )
    const btn = screen.getByTestId('guest-btn')
    fireEvent.click(btn)
    expect(btn.textContent).toBe('is-guest')
  })

  it('throws if useAuth is used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<AuthConsumer />)).toThrow('useAuth must be used within AuthProvider')
    spy.mockRestore()
  })
})
