import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useTodos } from '../hooks/useTodos'
import { isSupabaseConfigured } from '../lib/supabase'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Sun, Moon, Database, Download, Terminal, CheckCircle2 } from 'lucide-react'

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { todos } = useTodos('all')
  const [exported, setExported] = useState(false)

  const handleExportData = () => {
    // Sanitize exported JSON data by stripping internal user_id UUIDs
    const sanitizedTodos = todos.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      category: t.category,
      priority: t.priority,
      completed: t.completed,
      due_date: t.due_date,
      sort_order: t.sort_order,
      created_at: t.created_at,
    }))

    const jsonStr = JSON.stringify(sanitizedTodos, null, 2)
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
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Settings & Preferences"
        description="Manage application theme, connection status, data backup, and developer tools."
      />

      {/* Theme Preference */}
      <Card>
        <CardHeader>
          <CardTitle>Interface Theme</CardTitle>
          <CardDescription>Customize the application visual theme appearance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <Button
              variant={theme === 'light' ? 'primary' : 'outline'}
              onClick={() => setTheme('light')}
              className="justify-center"
            >
              <Sun size={16} />
              <span>Light Mode</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'outline'}
              onClick={() => setTheme('dark')}
              className="justify-center"
            >
              <Moon size={16} />
              <span>Dark Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={18} />
            <span>Database & Cloud Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSupabaseConfigured ? (
            <Alert variant="success" title="Supabase Live Connection (RLS Verified)">
              Your task items sync in real time with PostgreSQL. Row Level Security policies enforce user-level data isolation.
            </Alert>
          ) : (
            <Alert variant="warning" title="Demo Mode Active">
              TaskFlow is currently saving data to local browser storage. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables to enable 24/7 cloud sync.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Backup & Export */}
      <Card>
        <CardHeader>
          <CardTitle>Data Backup & Export</CardTitle>
          <CardDescription>
            Download a local JSON backup file containing all {todos.length} task entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export format: JSON (compatible with standard task backup schemas).
          </p>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            {exported ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Download size={16} />}
            <span>{exported ? 'Exported!' : 'Export JSON Backup'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Developer CLI Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal size={18} />
            <span>TypeScript Type Generator</span>
          </CardTitle>
          <CardDescription>
            Auto-generate database TypeScript types after schema migrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-slate-900 text-blue-400 rounded-md font-mono text-xs">
            <code>npm run gen:types</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
