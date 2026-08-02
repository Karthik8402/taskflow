import { useAuth } from '../../context/AuthContext'
import { Info, Database } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DemoBanner() {
  const { isGuest, isLiveSupabase } = useAuth()

  if (!isGuest && isLiveSupabase) return null

  return (
    <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md shrink-0">
          <Info size={18} />
        </div>
        <div>
          <div className="font-semibold text-xs flex items-center gap-2">
            <span>Demo Mode Active</span>
            <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Local Storage
            </span>
          </div>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
            Tasks are saved in browser storage. Connect Supabase keys in <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">.env.local</code> for 24/7 cloud sync.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
        >
          <Database size={14} />
          <span>Config Setup</span>
        </Link>
      </div>
    </div>
  )
}
