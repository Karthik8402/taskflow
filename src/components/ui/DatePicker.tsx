import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react'

interface DatePickerProps {
  label?: string
  value: string       // ISO date string 'YYYY-MM-DD' or ''
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
  errorText?: string
  helpText?: string
  minDate?: string    // 'YYYY-MM-DD'
  placement?: 'top' | 'bottom' | 'auto'
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplay(iso: string): string {
  if (!iso) return ''
  const d = toLocalDate(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  required,
  errorText,
  helpText,
  minDate,
  placement = 'auto',
}: DatePickerProps) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [hovered, setHovered] = useState<string | null>(null)
  const [dropUp, setDropUp] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Determine drop direction (up or down)
  useEffect(() => {
    if (open && wrapperRef.current) {
      if (placement === 'top') {
        setDropUp(true)
      } else if (placement === 'bottom') {
        setDropUp(false)
      } else {
        const rect = wrapperRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setDropUp(spaceBelow < 340)
      }
    }
  }, [open, placement])

  // Sync view to selected value when opening
  useEffect(() => {
    if (open && value) {
      const d = toLocalDate(value)
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [open, value])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const prevMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 0) { setViewYear(y => y - 1); return 11 }
      return m - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 11) { setViewYear(y => y + 1); return 0 }
      return m + 1
    })
  }, [])

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()

  const cells: { iso: string; inMonth: boolean }[] = []

  // Prev month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - 1, daysInPrev - i)
    cells.push({ iso: toISODate(d), inMonth: false })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ iso: toISODate(new Date(viewYear, viewMonth, d)), inMonth: true })
  }
  // Next month overflow (fill to complete 6 rows = 42 cells)
  let nextDay = 1
  while (cells.length < 42) {
    cells.push({ iso: toISODate(new Date(viewYear, viewMonth + 1, nextDay++)), inMonth: false })
  }

  const todayISO = toISODate(today)

  function handleSelect(iso: string) {
    if (minDate && iso < minDate) return
    onChange(iso)
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

  function isDisabled(iso: string) {
    return !!(minDate && iso < minDate)
  }

  // Priority coloring for weekends
  function isWeekend(iso: string) {
    const day = toLocalDate(iso).getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="space-y-1.5 w-full relative" ref={wrapperRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full h-11 px-3.5 flex items-center justify-between rounded-md border text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          errorText
            ? 'border-red-500 dark:border-red-500/80 bg-red-50 dark:bg-red-950/20'
            : open
              ? 'border-blue-500 dark:border-blue-400 bg-white dark:bg-slate-900 ring-2 ring-blue-500/25'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <span className={value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <span className="flex items-center gap-1.5">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={e => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
              className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Clear date"
            >
              <X size={14} />
            </span>
          )}
          <CalendarDays
            size={16}
            className={`transition-colors ${open ? 'text-blue-500' : 'text-slate-400'}`}
          />
        </span>
      </button>

      {/* Calendar Popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Date picker calendar"
          className={`absolute z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-72 overflow-hidden transition-all ${
            dropUp
              ? 'bottom-full mb-2 animate-in fade-in slide-in-from-bottom-2'
              : 'top-full mt-1 animate-in fade-in slide-in-from-top-2'
          }`}
          style={{ animation: 'datepicker-in 0.15s ease' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700/50 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              className="text-sm font-bold text-white hover:text-blue-100 transition-colors px-2 py-0.5 rounded-md"
              onClick={() => {
                setViewYear(today.getFullYear())
                setViewMonth(today.getMonth())
              }}
              title="Jump to current month"
            >
              {MONTHS[viewMonth]} {viewYear}
            </button>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700/50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map(d => (
              <div
                key={d}
                className={`text-center text-[10px] font-bold uppercase tracking-wider pb-1 ${
                  d === 'Su' || d === 'Sa'
                    ? 'text-blue-400 dark:text-blue-400/70'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
            {cells.map(({ iso, inMonth }) => {
              const selected = iso === value
              const isToday = iso === todayISO
              const disabled = isDisabled(iso)
              const weekend = isWeekend(iso)
              const isHovered = hovered === iso && !disabled

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(iso)}
                  onMouseEnter={() => !disabled && setHovered(iso)}
                  onMouseLeave={() => setHovered(null)}
                  className={`
                    relative h-9 w-full flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-100
                    ${disabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}
                    ${selected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : isToday && !selected
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-400/40'
                        : isHovered
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : ''
                    }
                    ${!inMonth && !selected ? 'opacity-30' : ''}
                    ${!selected && !isToday && inMonth && weekend ? 'text-blue-500 dark:text-blue-400' : ''}
                    ${!selected && !isToday && inMonth && !weekend ? 'text-slate-700 dark:text-slate-200' : ''}
                  `}
                  aria-label={iso}
                  aria-pressed={selected}
                  aria-current={isToday ? 'date' : undefined}
                >
                  {toLocalDate(iso).getDate()}
                  {isToday && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors py-1 px-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleSelect(todayISO)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-1 px-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              Today
            </button>
          </div>
        </div>
      )}

      {errorText && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{errorText}</p>
      )}
      {!errorText && helpText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  )
}
