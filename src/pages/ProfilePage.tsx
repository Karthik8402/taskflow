import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTodos } from '../hooks/useTodos'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  User as UserIcon,
  Sun,
  Moon,
  Database,
  Download,
  Terminal,
  ShieldCheck,
  Info,
  CheckCircle2,
  LogOut,
} from 'lucide-react'

export function ProfilePage() {
  const { user, isGuest, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { todos } = useTodos('all')
  const [exported, setExported] = useState(false)

  const handleExportData = () => {
    const jsonStr = JSON.stringify(todos, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <UserIcon size={24} className="text-indigo-600 dark:text-indigo-400" />
          <span>Account & System Settings</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage theme preferences, connection status, and task backups.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-gray-200/80 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User Profile'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                    isGuest
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isGuest ? 'Demo Mode' : 'Authenticated'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  ID: {user?.id?.substring(0, 12)}...
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>{isGuest ? 'Exit Demo Mode' : 'Sign Out'}</span>
          </button>
        </div>

        {/* Theme Preferences */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Interface Theme Preference
          </h3>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-indigo-400'
              }`}
            >
              <Sun size={18} className={theme === 'light' ? 'text-amber-300' : ''} />
              <span>Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-indigo-400'
              }`}
            >
              <Moon size={18} className={theme === 'dark' ? 'text-amber-300' : ''} />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Supabase Status Indicator */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Database size={15} />
            <span>Database & Cloud Connection Status</span>
          </h3>

          <div
            className={`p-4 rounded-2xl border ${
              isSupabaseConfigured
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSupabaseConfigured ? (
                <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-xs">
                  {isSupabaseConfigured
                    ? 'Supabase Cloud Connected (RLS Enabled)'
                    : 'Running in Demo Mode (Local Storage)'}
                </p>
                <p className="text-xs opacity-85">
                  {isSupabaseConfigured
                    ? 'All task operations sync in real-time with your PostgreSQL database.'
                    : 'To enable 24/7 cloud sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Type Generation Pipeline Note */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Terminal size={15} />
            <span>Supabase Schema Type Pipeline</span>
          </h3>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Run this script after database schema changes to auto-generate TypeScript types:
            </p>
            <div className="p-2.5 bg-black/90 text-indigo-400 rounded-xl font-mono text-xs flex items-center justify-between">
              <code>npm run gen:types</code>
            </div>
          </div>
        </div>

        {/* Data Backup Export */}
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Data Backup & Export
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Download a local JSON backup of all {todos.length} task records.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {exported ? <CheckCircle2 size={16} /> : <Download size={16} />}
              <span>{exported ? 'Exported!' : 'Export Backup'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
