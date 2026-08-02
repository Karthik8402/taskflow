import { useState, useMemo } from 'react'
import { useTodos } from '../hooks/useTodos'
import { isSupabaseConfigured } from '../lib/supabase'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Database,
  Trash2,
  CheckCheck,
} from 'lucide-react'

type NotificationFilter = 'all' | 'unread' | 'overdue' | 'system'

interface SystemNotification {
  id: string
  title: string
  message: string
  type: 'overdue' | 'today' | 'priority' | 'system'
  timestamp: string
  read: boolean
  todoId?: string
}

export function NotificationsPage() {
  const { todos, toggleTodo } = useTodos('all')
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  // Generate live notifications based on actual user todos + system state
  const notifications = useMemo(() => {
    const items: SystemNotification[] = []
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    // 1. Overdue & Due Today Task Alerts
    todos.forEach(t => {
      if (t.completed) return

      if (t.due_date) {
        const dueDate = new Date(t.due_date)
        const dueStr = dueDate.toISOString().split('T')[0]

        if (dueStr < todayStr) {
          items.push({
            id: `notif-overdue-${t.id}`,
            title: `Task Overdue: "${t.title}"`,
            message: `This ${t.priority} priority task was due on ${dueStr}. Action required.`,
            type: 'overdue',
            timestamp: t.due_date,
            read: readIds.has(`notif-overdue-${t.id}`),
            todoId: t.id,
          })
        } else if (dueStr === todayStr) {
          items.push({
            id: `notif-today-${t.id}`,
            title: `Due Today: "${t.title}"`,
            message: `Scheduled for completion today in your ${t.category} cycle.`,
            type: 'today',
            timestamp: t.due_date,
            read: readIds.has(`notif-today-${t.id}`),
            todoId: t.id,
          })
        }
      }

      if (t.priority === 'high' && !t.due_date) {
        items.push({
          id: `notif-prio-${t.id}`,
          title: `High Priority Focus: "${t.title}"`,
          message: `High priority item in your ${t.category} backlog.`,
          type: 'priority',
          timestamp: t.created_at,
          read: readIds.has(`notif-prio-${t.id}`),
          todoId: t.id,
        })
      }
    })

    // 2. System Status Notification
    if (isSupabaseConfigured) {
      items.push({
        id: 'notif-sys-supabase',
        title: 'Supabase Realtime Sync Connected',
        message: 'Your workspace is actively syncing changes 24/7 with PostgreSQL database.',
        type: 'system',
        timestamp: new Date().toISOString(),
        read: readIds.has('notif-sys-supabase'),
      })
    } else {
      items.push({
        id: 'notif-sys-guest',
        title: 'Guest Demo Mode Active',
        message: 'Your tasks are stored locally in browser storage. Connect Supabase for cloud sync.',
        type: 'system',
        timestamp: new Date().toISOString(),
        read: readIds.has('notif-sys-guest'),
      })
    }

    return items.filter(n => !dismissedIds.has(n.id))
  }, [todos, readIds, dismissedIds])

  // Filtered list
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'overdue') return n.type === 'overdue'
    if (filter === 'system') return n.type === 'system'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)))
  }

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]))
  }

  const dismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]))
  }

  const handleCompleteTask = async (todoId?: string, notifId?: string) => {
    if (todoId) {
      await toggleTodo(todoId, true)
    }
    if (notifId) {
      dismiss(notifId)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      {/* ── Page Header & Quick Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <PageHeader
          title="Notifications & Alerts"
          description="Live task deadlines, overdue alerts, and system connection notifications."
        />
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="self-start sm:self-auto">
            <CheckCheck size={16} />
            <span>Mark All as Read ({unreadCount})</span>
          </Button>
        )}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        {(['all', 'unread', 'overdue', 'system'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all'
              ? `All (${notifications.length})`
              : f === 'unread'
              ? `Unread (${unreadCount})`
              : f === 'overdue'
              ? `Overdue (${notifications.filter(n => n.type === 'overdue').length})`
              : 'System'}
          </button>
        ))}
      </div>

      {/* ── Notification Feed ── */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Bell size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No Notifications Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You're all caught up! There are no active notifications matching your selected filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(n => (
            <Card
              key={n.id}
              className={`transition-all duration-200 border ${
                !n.read
                  ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-85'
              }`}
            >
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Type Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                      n.type === 'overdue'
                        ? 'bg-red-500 shadow-red-500/20'
                        : n.type === 'today'
                        ? 'bg-amber-500 shadow-amber-500/20'
                        : n.type === 'priority'
                        ? 'bg-purple-500 shadow-purple-500/20'
                        : 'bg-blue-600 shadow-blue-500/20'
                    }`}
                  >
                    {n.type === 'overdue' ? (
                      <AlertTriangle size={20} />
                    ) : n.type === 'today' ? (
                      <Clock size={20} />
                    ) : n.type === 'priority' ? (
                      <Bell size={20} />
                    ) : (
                      <Database size={20} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </h4>
                      {!n.read && <Badge variant="danger">New</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                      {new Date(n.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {n.todoId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteTask(n.todoId, n.id)}
                      className="text-xs"
                    >
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="hidden sm:inline">Mark Complete</span>
                    </Button>
                  )}
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      title="Mark as read"
                      aria-label="Mark notification as read"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(n.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Dismiss"
                    aria-label="Dismiss notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
