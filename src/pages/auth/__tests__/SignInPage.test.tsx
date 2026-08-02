import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SignInPage } from '../SignInPage'
import { AuthProvider } from '../../../context/AuthContext'
import { ThemeProvider } from '../../../context/ThemeContext'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('../../../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn(),
    },
  },
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  </MemoryRouter>
)

describe('SignInPage component', () => {
  it('renders Sign in title and form fields', () => {
    const { container } = render(<SignInPage />, { wrapper })
    expect(screen.getByText('Sign in to TaskFlow')).toBeTruthy()
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy()
    expect(container.querySelector('input[type="password"]')).toBeTruthy()
  })

  it('email field has correct autoComplete="email" attribute', () => {
    render(<SignInPage />, { wrapper })
    const emailInput = screen.getByPlaceholderText('you@example.com')
    expect(emailInput.getAttribute('autocomplete')).toBe('email')
  })

  it('allows user typing into email and password inputs', () => {
    const { container } = render(<SignInPage />, { wrapper })
    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passInput = container.querySelector('input[type="password"]') as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passInput, { target: { value: 'Secret123!' } })

    expect((emailInput as HTMLInputElement).value).toBe('user@example.com')
    expect(passInput.value).toBe('Secret123!')
  })
})
