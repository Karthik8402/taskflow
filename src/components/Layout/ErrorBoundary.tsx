import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TaskFlow Error Boundary caught an exception:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100">
          <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center space-y-6 border border-red-500/20 shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto stroke-[1.5]">
              <AlertTriangle size={36} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                TaskFlow encountered an unexpected rendering error.
              </p>
              {this.state.error && (
                <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 text-left font-mono text-xs text-red-600 dark:text-red-400 overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer shadow-lg shadow-indigo-500/25"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
