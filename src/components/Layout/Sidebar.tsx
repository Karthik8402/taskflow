import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Sparkles,
  User as UserIcon,
  X,
  CheckCircle2,
  ListTodo,
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
    daily: todos.filter(t => t.category === 'daily').length,
    weekly: todos.filter(t => t.category === 'weekly').length,
    monthly: todos.filter(t => t.category === 'monthly').length,
    total: todos.length,
  }

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, count: counts.total },
    { label: 'Daily Tasks', path: '/daily', icon: Clock, count: counts.daily, badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { label: 'Weekly Goals', path: '/weekly', icon: Calendar, count: counts.weekly, badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { label: 'Monthly Targets', path: '/monthly', icon: Sparkles, count: counts.monthly, badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { label: 'Account & Settings', path: '/profile', icon: UserIcon },
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <ListTodo size={18} />
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">Task Monitoring</span>
        </div>
        {isOpen && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-1 flex-1">
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isOpen && onClose()}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={active ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                <span>{item.label}</span>
              </div>
              {typeof item.count === 'number' && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : item.badgeColor || 'bg-gray-200/60 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="pt-4 mt-auto border-t border-gray-200/60 dark:border-gray-800/60 px-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 dark:border-indigo-500/10 text-xs">
          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-indigo-500" />
            <span>24/7 Status Active</span>
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Task synchronization engine active with keep-alive monitoring.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 glass-panel border-r border-gray-200/50 dark:border-gray-800/50 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0F172A] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
