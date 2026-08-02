import { forwardRef, type InputHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helpText?: string
  errorText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helpText, errorText, className = '', id, required, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(errorText)}
            aria-describedby={
              errorText ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
            }
            className={`w-full h-11 px-3.5 bg-white dark:bg-slate-900 border rounded-md text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
              errorText
                ? 'border-red-500 dark:border-red-500/80 focus:ring-red-500/50 pr-10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            } ${className}`}
            {...props}
          />
          {errorText && (
            <AlertCircle
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none"
            />
          )}
        </div>
        {errorText && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-600 dark:text-red-400">
            {errorText}
          </p>
        )}
        {!errorText && helpText && (
          <p id={`${inputId}-help`} className="text-xs text-slate-500 dark:text-slate-400">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
