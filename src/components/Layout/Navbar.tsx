import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  CheckCircle2,
  LayoutDashboard,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react'

interface NavbarProps {
  onToggleSidebar?: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, isGuest, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Daily', path: '/daily', icon: Clock },
    { label: 'Weekly', path: '/weekly', icon: Calendar },
    { label: 'Monthly', path: '/monthly', icon: Sparkles },
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 md:hidden transition-colors cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <CheckCircle2 size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-gray-100 dark:to-indigo-300 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase -mt-1">
                Pro Productivity
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-gray-100/70 dark:bg-gray-900/60 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm shadow-black/5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/40'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right: Theme Toggle & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50 transition-all duration-150 cursor-pointer"
            aria-label="Toggle Theme Mode"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={18} className="text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl border border-gray-200/80 dark:border-gray-800 hover:bg-gray-100/60 dark:hover:bg-gray-800/50 transition-all duration-150 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 max-w-[100px] truncate hidden sm:inline">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 z-50 shadow-2xl border border-gray-200/80 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800/80">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user?.user_metadata?.full_name || 'TaskFlow User'}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                    {isGuest && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-md">
                        Demo Mode Active
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                    >
                      <UserIcon size={15} />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-gray-100 dark:border-gray-800/80">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={15} />
                      <span>{isGuest ? 'Exit Demo' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
