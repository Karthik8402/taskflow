import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helpText?: string
  errorText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helpText, errorText, className = '', id, required, children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(errorText)}
          className={`w-full h-11 px-3.5 bg-white dark:bg-slate-900 border rounded-md text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all ${
            errorText
              ? 'border-red-500 dark:border-red-500/80 focus:ring-red-500/50'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {errorText && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">{errorText}</p>
        )}
        {!errorText && helpText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
