import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Sparkles,
  BarChart2,
  Settings,
  X,
  CheckCircle2,
  Bell,
  HelpCircle,
} from 'lucide-react'
import { useTodos } from '../../hooks/useTodos'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { todos } = useTodos('all')

  const counts = {
    total: todos.length,
    daily: todos.filter(t => t.category === 'daily').length,
    weekly: todos.filter(t => t.category === 'weekly').length,
    monthly: todos.filter(t => t.category === 'monthly').length,
  }

  const primaryItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, count: counts.total },
    { label: 'Daily Tasks', path: '/daily', icon: Clock, count: counts.daily },
    { label: 'Weekly Goals', path: '/weekly', icon: Calendar, count: counts.weekly },
    { label: 'Monthly Targets', path: '/monthly', icon: Sparkles, count: counts.monthly },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  ]

  const secondaryItems = [
    { label: 'Landing Page', path: '/landing', icon: Sparkles },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings & Data', path: '/settings', icon: Settings },
    { label: 'Help & Docs', path: '/help', icon: HelpCircle },
  ]

  const isActive = (path: string) => {
    if (location.pathname === path) return true
    if (path !== '/' && path !== '/dashboard' && location.pathname.startsWith(path)) return true
    return false
  }

  const content = (
    <div className="flex flex-col h-full py-5 px-3">
      <div className="flex items-center justify-between px-2 mb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <CheckCircle2 size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              TaskFlow
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider -mt-0.5">
              Task Management
            </span>
          </div>
        </Link>
        {isOpen && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-1 flex-1">
        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Core Workspaces
        </p>
        {primaryItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isOpen && onClose()}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={active ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                <span>{item.label}</span>
              </div>
              {typeof item.count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}

        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-6 mb-2">
          System & Settings
        </p>
        {secondaryItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isOpen && onClose()}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:block w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 modal-scrim transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
