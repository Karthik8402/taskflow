import { describe, it, expect } from 'vitest'
import {
  validateTaskInput,
  validatePassword,
  getAuthErrorMessage,
  isValidInternalRedirect,
  TASK_CONSTRAINTS,
} from '../validation'

describe('validateTaskInput', () => {
  it('UNIT-01: rejects empty or whitespace-only title', () => {
    const errors = validateTaskInput({ title: '   ' })
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('title')
    expect(errors[0].message).toBe('Task title is required.')
  })

  it('UNIT-02: rejects title over max length limit', () => {
    const longTitle = 'a'.repeat(TASK_CONSTRAINTS.TITLE_MAX_LENGTH + 1)
    const errors = validateTaskInput({ title: longTitle })
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('title')
    expect(errors[0].message).toContain('120 characters')
  })

  it('UNIT-03: rejects invalid priority', () => {
    const errors = validateTaskInput({ title: 'Valid Title', priority: 'extreme' })
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('priority')
  })

  it('UNIT-04: rejects invalid category', () => {
    const errors = validateTaskInput({ title: 'Valid Title', category: 'yearly' })
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('category')
  })

  it('accepts valid task inputs', () => {
    const errors = validateTaskInput({
      title: 'Valid task title',
      description: 'Some valid notes',
      category: 'daily',
      priority: 'high',
    })
    expect(errors).toHaveLength(0)
  })
})

describe('validatePassword', () => {
  it('CMP-02: requires minimum 8 characters and complexity', () => {
    expect(validatePassword('short').valid).toBe(false)
    expect(validatePassword('12345678').valid).toBe(false) // Missing uppercase & special char
    expect(validatePassword('Password123').valid).toBe(false) // Missing special char
    expect(validatePassword('P@ssword123').valid).toBe(true) // Valid: >=8 chars, 1 uppercase, 1 number, 1 special char
  })
})

describe('getAuthErrorMessage', () => {
  it('UNIT-07: maps raw backend error messages into friendly user messages', () => {
    expect(getAuthErrorMessage(new Error('Invalid login credentials'))).toContain(
      'Invalid email or password'
    )
    expect(getAuthErrorMessage(new Error('User already registered'))).toContain(
      'already exists'
    )
    expect(getAuthErrorMessage(new Error('rate limit reached'))).toContain('Too many attempts')
    expect(getAuthErrorMessage(null)).toBe('An unexpected authentication error occurred.')
  })
})

describe('isValidInternalRedirect', () => {
  it('UNIT-08: validates internal redirect paths safely', () => {
    expect(isValidInternalRedirect('/')).toBe(true)
    expect(isValidInternalRedirect('/daily')).toBe(true)
    expect(isValidInternalRedirect('//external.com')).toBe(false)
    expect(isValidInternalRedirect('https://malicious.com')).toBe(false)
    expect(isValidInternalRedirect(null)).toBe(false)
  })
})
