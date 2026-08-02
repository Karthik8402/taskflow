
export const TASK_CONSTRAINTS = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 2000,
  PASSWORD_MIN_LENGTH: 8,
} as const

export interface TaskValidationError {
  field: 'title' | 'description' | 'category' | 'priority' | 'due_date'
  message: string
}

export function validateTaskInput(input: {
  title?: string
  description?: string
  category?: string
  priority?: string
}): TaskValidationError[] {
  const errors: TaskValidationError[] = []

  const trimmedTitle = (input.title || '').trim()
  if (!trimmedTitle) {
    errors.push({ field: 'title', message: 'Task title is required.' })
  } else if (trimmedTitle.length > TASK_CONSTRAINTS.TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Task title must be ${TASK_CONSTRAINTS.TITLE_MAX_LENGTH} characters or less.`,
    })
  }

  if (input.description && input.description.length > TASK_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) {
    errors.push({
      field: 'description',
      message: `Description must be ${TASK_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters or less.`,
    })
  }

  if (input.category && !['daily', 'weekly', 'monthly'].includes(input.category)) {
    errors.push({ field: 'category', message: 'Category must be daily, weekly, or monthly.' })
  }

  if (input.priority && !['low', 'medium', 'high'].includes(input.priority)) {
    errors.push({ field: 'priority', message: 'Priority must be low, medium, or high.' })
  }

  return errors
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < TASK_CONSTRAINTS.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${TASK_CONSTRAINTS.PASSWORD_MIN_LENGTH} characters long.`,
    }
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)

  if (!hasUppercase || !hasNumber || !hasSpecial) {
    return {
      valid: false,
      message: 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.',
    }
  }

  return { valid: true }
}

export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected authentication error occurred.'
  const rawMessage = error instanceof Error ? error.message : String(error)
  const lower = rawMessage.toLowerCase()

  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'An account with this email address already exists. Please sign in instead.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the verification link.'
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a few moments before trying again.'
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters and numbers.'
  }

  return 'Could not process authentication request. Please try again.'
}

export function isValidInternalRedirect(path: string | null | undefined): boolean {
  if (!path) return false
  // Must start with single slash and not double slash (prevents //external.com phishing)
  if (!path.startsWith('/') || path.startsWith('//')) return false
  // Disallow protocols
  if (path.includes(':')) return false
  return true
}
