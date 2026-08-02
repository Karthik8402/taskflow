import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function AuthHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="w-full bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <CheckCircle2 size={20} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 dark:from-white dark:via-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
