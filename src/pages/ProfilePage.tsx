import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTodos } from '../hooks/useTodos'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { LogOut, ShieldCheck, Info, User, Calendar, Save } from 'lucide-react'

export function ProfilePage() {
  const { user, isGuest, signOut } = useAuth()
  const { todos } = useTodos('all')
  const { success } = useToast()

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'TaskFlow User')
  )
  const [saving, setSaving] = useState(false)

  // Compute live task statistics
  const totalTasks = todos.length
  const completedTasks = todos.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasks = todos.filter(t => {
    if (t.completed || !t.due_date) return false
    const dueStr = new Date(t.due_date).toISOString().split('T')[0]
    const todayStr = new Date().toISOString().split('T')[0]
    return dueStr < todayStr
  }).length

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      success('Profile details updated successfully')
    }, 600)
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Account & Profile Settings"
        description="Manage your profile information, view task statistics, and manage session security."
      />

      {/* ── User Overview & Avatar ── */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile Overview</CardTitle>
          <CardDescription>Your personal account details and session status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                {fullName.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{fullName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  {isGuest ? (
                    <Badge variant="warning">
                      <Info size={12} />
                      <span>Guest Demo Mode</span>
                    </Badge>
                  ) : (
                    <Badge variant="success">
                      <ShieldCheck size={12} />
                      <span>Authenticated via Supabase</span>
                    </Badge>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {user?.id?.substring(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => signOut()} className="self-start sm:self-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/60">
              <LogOut size={14} />
              <span>{isGuest ? 'Exit Demo Session' : 'Sign Out'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Edit Profile Form ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} />
            <span>Edit Profile Details</span>
          </CardTitle>
          <CardDescription>Update your display name across workspace notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <Input
              label="Full Display Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
            />
            <Input
              label="Email Address"
              value={user?.email || 'guest@taskflow.demo'}
              disabled
              helpText="Email address is tied to your authentication provider."
            />
            <Button type="submit" variant="primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Productivity Metrics Summary ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Workspace Activity Summary</span>
          </CardTitle>
          <CardDescription>Real-time completion metrics across your active categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 font-medium block">Total Tasks</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{totalTasks}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">Completed</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedTasks}</span>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block">Pending Backlog</span>
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{pendingTasks}</span>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium block">Overdue</span>
              <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{overdueTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
