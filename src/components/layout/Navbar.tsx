import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  CheckCircle2,
  Sun,
  Moon,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Info,
} from 'lucide-react'
import { DropdownMenu } from '../ui/DropdownMenu'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface NavbarProps {
  onToggleSidebar?: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, isGuest, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const userMenuItems = [
    {
      label: 'Account & Settings',
      icon: <Settings size={15} />,
      onClick: () => {
        window.location.href = '/settings'
      },
    },
    {
      label: isGuest ? 'Exit Demo Mode' : 'Sign Out',
      icon: <LogOut size={15} />,
      variant: 'danger' as const,
      onClick: () => {
        signOut()
      },
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="md:hidden"
              aria-label="Open Navigation Drawer"
            >
              <Menu size={20} />
            </Button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <CheckCircle2 size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                TaskFlow
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase -mt-1">
                Pro
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Mode status, Theme Toggle, User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div className="hidden sm:block">
            {isGuest ? (
              <Badge variant="warning">
                <Info size={12} />
                <span>Demo Mode</span>
              </Badge>
            ) : (
              <Badge variant="success">
                <ShieldCheck size={12} />
                <span>Cloud Sync</span>
              </Badge>
            )}
          </div>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-blue-600" />
            )}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu
            align="right"
            trigger={
              <div className="flex items-center gap-2 p-1 pl-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate hidden sm:inline">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'}
                </span>
              </div>
            }
            items={userMenuItems}
          />
        </div>
      </div>
    </header>
  )
}
