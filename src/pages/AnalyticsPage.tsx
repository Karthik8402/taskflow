import { useTodos } from '../hooks/useTodos'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react'

export function AnalyticsPage() {
  const { todos } = useTodos('all')

  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const pending = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length
  const mediumPriority = todos.filter(t => t.priority === 'medium' && !t.completed).length
  const lowPriority = todos.filter(t => t.priority === 'low' && !t.completed).length

  const categories = [
    {
      id: 'daily',
      name: 'Daily Tasks',
      icon: Clock,
      items: todos.filter(t => t.category === 'daily'),
    },
    {
      id: 'weekly',
      name: 'Weekly Goals',
      icon: Calendar,
      items: todos.filter(t => t.category === 'weekly'),
    },
    {
      id: 'monthly',
      name: 'Monthly Targets',
      icon: Sparkles,
      items: todos.filter(t => t.category === 'monthly'),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productivity Analytics"
        description="Detailed insights and task completion distribution across your workspace."
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completion Rate
              </p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {completionRate}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {completed} of {total} completed
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {completed}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks finished</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
              <CheckCircle2 size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Focus
              </p>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {pending}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks in progress</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md">
              <Clock size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                High Priority
              </p>
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                {highPriority}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Needs immediate focus</p>
            </div>
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Completion Breakdown</CardTitle>
          <CardDescription>
            Progress tracking separated by Daily, Weekly, and Monthly cycles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map(cat => {
            const catTotal = cat.items.length
            const catDone = cat.items.filter(t => t.completed).length
            const catPct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0
            const Icon = cat.icon

            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Icon size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>{cat.name}</span>
                    <Badge variant="default">
                      {catDone}/{catTotal} done
                    </Badge>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{catPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${catPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Priority Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">High Priority</span>
              <Badge variant="danger">{highPriority} active</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{highPriority}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Urgent items awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Medium Priority</span>
              <Badge variant="warning">{mediumPriority} active</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mediumPriority}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Standard operational tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Low Priority</span>
              <Badge variant="success">{lowPriority} active</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{lowPriority}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Background tasks and backlog</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
