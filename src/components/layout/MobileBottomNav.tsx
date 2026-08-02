import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Clock, Calendar, Sparkles, BarChart2 } from 'lucide-react'

export function MobileBottomNav() {
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Daily', path: '/daily', icon: Clock },
    { label: 'Weekly', path: '/weekly', icon: Calendar },
    { label: 'Monthly', path: '/monthly', icon: Sparkles },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  ]

  const isActive = (path: string) => {
    if (location.pathname === path) return true
    if (path !== '/' && path !== '/dashboard' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer min-w-[56px] ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={active ? 'stroke-[2.5]' : 'stroke-[1.75]'} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
