import { forwardRef, type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helpText?: string
  errorText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helpText, errorText, className = '', id, required, ...props }, ref) => {
    const textareaId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={Boolean(errorText)}
          aria-describedby={
            errorText ? `${textareaId}-error` : helpText ? `${textareaId}-help` : undefined
          }
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border rounded-md text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y min-h-[80px] ${
            errorText
              ? 'border-red-500 dark:border-red-500/80 focus:ring-red-500/50'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          } ${className}`}
          {...props}
        />
        {errorText && (
          <p id={`${textareaId}-error`} className="text-xs font-medium text-red-600 dark:text-red-400">
            {errorText}
          </p>
        )}
        {!errorText && helpText && (
          <p id={`${textareaId}-help`} className="text-xs text-slate-500 dark:text-slate-400">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
