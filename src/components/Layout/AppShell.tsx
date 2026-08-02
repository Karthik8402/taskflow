import { useState, type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { ToastProvider } from '../../context/ToastContext'

export interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-150">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-md shadow-lg"
        >
          Skip to main content
        </a>

        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main id="main-content" className="flex-1 min-w-0 pb-16 md:pb-0">
            {children}
          </main>
        </div>

        <MobileBottomNav />
      </div>
    </ToastProvider>
  )
}
