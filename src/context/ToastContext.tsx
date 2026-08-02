import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Theme-aware style map — white in light mode, dark in dark mode
const TOAST_STYLES: Record<ToastType, {
  wrapper: string
  icon: string
  IconComponent: typeof CheckCircle2
  bar: string
}> = {
  success: {
    wrapper:
      'bg-white dark:bg-slate-900 ' +
      'border-emerald-200 dark:border-emerald-800/60 ' +
      'text-slate-800 dark:text-slate-100 ' +
      'shadow-emerald-100/50 dark:shadow-black/30',
    icon: 'text-emerald-500 dark:text-emerald-400',
    IconComponent: CheckCircle2,
    bar: 'bg-emerald-500',
  },
  error: {
    wrapper:
      'bg-white dark:bg-slate-900 ' +
      'border-red-200 dark:border-red-800/60 ' +
      'text-slate-800 dark:text-slate-100 ' +
      'shadow-red-100/50 dark:shadow-black/30',
    icon: 'text-red-500 dark:text-red-400',
    IconComponent: AlertCircle,
    bar: 'bg-red-500',
  },
  warning: {
    wrapper:
      'bg-white dark:bg-slate-900 ' +
      'border-amber-200 dark:border-amber-800/60 ' +
      'text-slate-800 dark:text-slate-100 ' +
      'shadow-amber-100/50 dark:shadow-black/30',
    icon: 'text-amber-500 dark:text-amber-400',
    IconComponent: AlertTriangle,
    bar: 'bg-amber-500',
  },
  info: {
    wrapper:
      'bg-white dark:bg-slate-900 ' +
      'border-blue-200 dark:border-blue-800/60 ' +
      'text-slate-800 dark:text-slate-100 ' +
      'shadow-blue-100/50 dark:shadow-black/30',
    icon: 'text-blue-500 dark:text-blue-400',
    IconComponent: Info,
    bar: 'bg-blue-500',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts(prev => [...prev, { id, type, message }])
      setTimeout(() => removeToast(id), 4000)
    },
    [removeToast]
  )

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast])
  const error   = useCallback((msg: string) => toast(msg, 'error'),   [toast])
  const info    = useCallback((msg: string) => toast(msg, 'info'),    [toast])
  const warning = useCallback((msg: string) => toast(msg, 'warning'), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* Toast Notification Stack */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map(t => {
          const { wrapper, icon, IconComponent, bar } = TOAST_STYLES[t.type]
          return (
            <div
              key={t.id}
              role="status"
              style={{ animation: 'toast-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              className={`
                pointer-events-auto relative flex items-center justify-between
                gap-3 pl-4 pr-3 py-3.5 rounded-xl border shadow-lg overflow-hidden
                ${wrapper}
              `}
            >
              {/* Coloured left accent bar */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-[3px] ${bar} rounded-l-xl`}
              />

              <div className="flex items-center gap-2.5 min-w-0">
                <IconComponent size={17} className={`${icon} shrink-0`} />
                <span className="text-xs font-semibold leading-snug truncate">
                  {t.message}
                </span>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                className="
                  shrink-0 p-1 rounded-md cursor-pointer transition-colors
                  text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
                  hover:bg-slate-100 dark:hover:bg-slate-800
                "
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
