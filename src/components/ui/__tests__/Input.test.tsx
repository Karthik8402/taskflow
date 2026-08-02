import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input component', () => {
  it('renders with label', () => {
    render(<Input label="Email Address" />)
    expect(screen.getByText('Email Address')).toBeTruthy()
  })

  it('renders placeholder text', () => {
    render(<Input placeholder="you@example.com" />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy()
  })

  it('calls onChange when user types', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders in disabled state', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows error message when errorText prop passed', () => {
    render(<Input errorText="This field is required" />)
    expect(screen.getByText('This field is required')).toBeTruthy()
  })
})
