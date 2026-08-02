import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, className = '', id, ...props }, ref) => {
    const checkboxId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300 ${className}`}
      >
        <div className="relative inline-flex items-center justify-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500/50 transition-all flex items-center justify-center">
            {checked && <Check size={14} className="text-white stroke-[3]" />}
          </div>
        </div>
        {label && <span>{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
