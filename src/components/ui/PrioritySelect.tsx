import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Zap, Minus, ArrowUp } from 'lucide-react'
import type { TodoPriority } from '../../types'

interface PriorityOption {
  value: TodoPriority
  label: string
  description: string
  icon: typeof Zap
  color: string          // tailwind text color
  bg: string             // tailwind bg for selected pill
  ringColor: string      // tailwind ring color on open
  dot: string            // dot bg color
}

const OPTIONS: PriorityOption[] = [
  {
    value: 'low',
    label: 'Low Priority',
    description: 'Nice-to-have, no rush',
    icon: Minus,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
    ringColor: 'ring-emerald-400/40',
    dot: 'bg-emerald-500',
  },
  {
    value: 'medium',
    label: 'Medium Priority',
    description: 'Important, plan for it',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
    ringColor: 'ring-amber-400/40',
    dot: 'bg-amber-500',
  },
  {
    value: 'high',
    label: 'High Priority',
    description: 'Urgent, do it today',
    icon: ArrowUp,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
    ringColor: 'ring-red-400/40',
    dot: 'bg-red-500',
  },
]

interface PrioritySelectProps {
  label?: string
  value: TodoPriority
  onChange: (val: TodoPriority) => void
  required?: boolean
  errorText?: string
  placement?: 'top' | 'bottom' | 'auto'
}

export function PrioritySelect({
  label,
  value,
  onChange,
  required,
  errorText,
  placement = 'auto',
}: PrioritySelectProps) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const selected = OPTIONS.find(o => o.value === value) ?? OPTIONS[1]

  useEffect(() => {
    if (open && wrapperRef.current) {
      if (placement === 'top') {
        setDropUp(true)
      } else if (placement === 'bottom') {
        setDropUp(false)
      } else {
        const rect = wrapperRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setDropUp(spaceBelow < 220)
      }
    }
  }, [open, placement])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'ArrowDown') {
        const idx = OPTIONS.findIndex(o => o.value === value)
        if (idx < OPTIONS.length - 1) onChange(OPTIONS[idx + 1].value)
      }
      if (e.key === 'ArrowUp') {
        const idx = OPTIONS.findIndex(o => o.value === value)
        if (idx > 0) onChange(OPTIONS[idx - 1].value)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, value, onChange])

  const SelectedIcon = selected.icon

  return (
    <div className="space-y-1.5 w-full relative" ref={wrapperRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full h-11 px-3.5 flex items-center justify-between rounded-md border transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 ${
          open
            ? `border-transparent ring-2 ${selected.ringColor} ${selected.bg}`
            : `${selected.bg} hover:opacity-90`
        } ${errorText ? 'border-red-500' : ''}`}
      >
        <span className="flex items-center gap-2.5">
          <span className={`flex items-center justify-center w-6 h-6 rounded-md ${selected.dot.replace('bg-', 'bg-opacity-15 bg-')} `}>
            <SelectedIcon size={14} className={selected.color} />
          </span>
          <span className={`text-sm font-semibold ${selected.color}`}>{selected.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={`${selected.color} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Priority level"
          className={`absolute z-[100] w-full min-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden transition-all ${
            dropUp
              ? 'bottom-full mb-2 animate-in fade-in slide-in-from-bottom-2'
              : 'top-full mt-1 animate-in fade-in slide-in-from-top-2'
          }`}
          style={{ animation: 'datepicker-in 0.12s ease' }}
        >
          <div className="p-1.5 space-y-0.5">
            {OPTIONS.map(opt => {
              const Icon = opt.icon
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-100 cursor-pointer group ${
                    isSelected
                      ? opt.bg
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {/* Icon badge */}
                  <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    isSelected
                      ? `${opt.dot} bg-opacity-20`
                      : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    <Icon size={15} className={isSelected ? opt.color : 'text-slate-500 dark:text-slate-400'} />
                  </span>

                  {/* Labels */}
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-semibold ${isSelected ? opt.color : 'text-slate-800 dark:text-slate-100'}`}>
                      {opt.label}
                    </span>
                    <span className="block text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {opt.description}
                    </span>
                  </span>

                  {/* Check mark */}
                  {isSelected && (
                    <Check size={16} className={`flex-shrink-0 ${opt.color}`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Keyboard hint */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5">
            <kbd className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">↑↓</kbd>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">to navigate</span>
            <kbd className="ml-2 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">Esc</kbd>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">to close</span>
          </div>
        </div>
      )}

      {errorText && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{errorText}</p>
      )}
    </div>
  )
}
