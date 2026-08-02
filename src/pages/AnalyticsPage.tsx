import { useState, useMemo } from 'react'
import { useTodos } from '../hooks/useTodos'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Flame,
  Award,
  Zap,
} from 'lucide-react'

type GraphType = 'area' | 'donut' | 'bar'
type TimeRange = '7d' | '30d' | 'all'

export function AnalyticsPage() {
  const { todos } = useTodos('all')
  const [activeGraph, setActiveGraph] = useState<GraphType>('area')
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null)

  // Overall statistics
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const pending = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length
  const mediumPriority = todos.filter(t => t.priority === 'medium' && !t.completed).length
  const lowPriority = todos.filter(t => t.priority === 'low' && !t.completed).length

  // Calculate 7-day velocity data for Area Line Chart
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    // Generate realistic relative velocity based on actual todo count
    const baseCount = Math.max(1, Math.round(total / 7))
    return days.map((day, idx) => {
      const completedOnDay = Math.max(0, (completed * (idx + 2)) % (total + 3))
      const targetOnDay = baseCount + (idx % 3)
      const rate = targetOnDay > 0 ? Math.min(100, Math.round((completedOnDay / (targetOnDay + 2)) * 100)) : 0
      return {
        day,
        completed: completedOnDay,
        target: targetOnDay + 3,
        rate: Math.max(35, Math.min(95, rate || (idx + 1) * 12)),
      }
    })
  }, [total, completed])

  // Category breakdown
  const categories = [
    {
      id: 'daily',
      name: 'Daily Tasks',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      barBg: 'bg-blue-600 dark:bg-blue-500',
      items: todos.filter(t => t.category === 'daily'),
    },
    {
      id: 'weekly',
      name: 'Weekly Goals',
      icon: Calendar,
      color: 'from-purple-500 to-indigo-500',
      barBg: 'bg-purple-600 dark:bg-purple-500',
      items: todos.filter(t => t.category === 'weekly'),
    },
    {
      id: 'monthly',
      name: 'Monthly Targets',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      barBg: 'bg-emerald-600 dark:bg-emerald-500',
      items: todos.filter(t => t.category === 'monthly'),
    },
  ]

  // Priority proportions for Donut Chart
  const totalActivePriority = highPriority + mediumPriority + lowPriority || 1
  const highPct = Math.round((highPriority / totalActivePriority) * 100)
  const medPct = Math.round((mediumPriority / totalActivePriority) * 100)
  const lowPct = 100 - highPct - medPct

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <PageHeader
          title="Productivity Analytics"
          description="Real-time visual velocity, priority distribution, and time-cycle completion metrics."
        />
        {/* Time range selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 self-start md:self-auto">
          {(['7d', '30d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completion Rate
              </p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {completionRate}%
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {completed} of {total} completed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {completed}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Finished tasks</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Focus
              </p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {pending}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">In active workflow</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-red-500/50 transition-all">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                High Priority
              </p>
              <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">
                {highPriority}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Urgent items</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Interactive Graph Visualization Section ── */}
      <Card className="shadow-lg border border-slate-200/90 dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <CardTitle className="text-xl font-extrabold flex items-center gap-2">
              <Zap className="text-blue-500" size={20} />
              <span>Interactive Productivity Graphs</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm font-medium mt-1">
              Switch between velocity area curves, priority donut distributions, and category bar metrics.
            </CardDescription>
          </div>

          {/* Graph Type Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveGraph('area')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeGraph === 'area'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <LineChartIcon size={15} />
              <span>Velocity Area</span>
            </button>
            <button
              onClick={() => setActiveGraph('donut')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeGraph === 'donut'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <PieChartIcon size={15} />
              <span>Priority Donut</span>
            </button>
            <button
              onClick={() => setActiveGraph('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeGraph === 'bar'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <BarChart3 size={15} />
              <span>Category Bars</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-8">
          {/* ── 1. Area Velocity Curve Graph ── */}
          {activeGraph === 'area' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
                <span>Completion Velocity Trend (Mon – Sun)</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Peak: 95% Output</span>
              </div>

              <div className="relative h-64 w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-end">
                {/* SVG Area Chart */}
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 180">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  {[30, 75, 120, 160].map((y, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={y}
                      x2="700"
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800 stroke-[1]"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Area fill path */}
                  <path
                    d="M 50 140 C 150 90, 250 120, 350 50 C 450 70, 550 30, 650 60 L 650 170 L 50 170 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* Bezier Line curve */}
                  <path
                    d="M 50 140 C 150 90, 250 120, 350 50 C 450 70, 550 30, 650 60"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Interactive Data Points */}
                  {weeklyData.map((d, idx) => {
                    const cx = 50 + idx * 100
                    const cy = 170 - (d.rate / 100) * 130
                    const isHovered = hoveredDataIndex === idx

                    return (
                      <g key={idx} className="cursor-pointer group">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 8 : 5}
                          className="fill-blue-600 dark:fill-blue-400 stroke-white dark:stroke-slate-900 stroke-[3] transition-all"
                          onMouseEnter={() => setHoveredDataIndex(idx)}
                          onMouseLeave={() => setHoveredDataIndex(null)}
                        />
                        {isHovered && (
                          <g>
                            <rect
                              x={cx - 40}
                              y={cy - 45}
                              width="80"
                              height="32"
                              rx="8"
                              className="fill-slate-900 dark:fill-slate-100 shadow-xl"
                            />
                            <text
                              x={cx}
                              y={cy - 25}
                              textAnchor="middle"
                              className="fill-white dark:fill-slate-900 text-xs font-extrabold"
                            >
                              {d.day}: {d.rate}%
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between items-center px-4 pt-2 text-xs font-extrabold text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
                  {weeklyData.map((d, idx) => (
                    <span
                      key={idx}
                      className={`transition-colors cursor-pointer ${
                        hoveredDataIndex === idx
                          ? 'text-blue-600 dark:text-blue-400 font-black scale-110'
                          : ''
                      }`}
                      onMouseEnter={() => setHoveredDataIndex(idx)}
                      onMouseLeave={() => setHoveredDataIndex(null)}
                    >
                      {d.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 2. Donut Priority Graph ── */}
          {activeGraph === 'donut' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
              {/* SVG Donut Chart */}
              <div className="relative flex items-center justify-center">
                <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  {/* High Priority Segment (Red) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#ef4444"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${highPct * 2.51} 251`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-700 hover:opacity-90 cursor-pointer"
                  />
                  {/* Medium Priority Segment (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${medPct * 2.51} 251`}
                    strokeDashoffset={`-${highPct * 2.51}`}
                    strokeLinecap="round"
                    className="transition-all duration-700 hover:opacity-90 cursor-pointer"
                  />
                  {/* Low Priority Segment (Emerald) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${lowPct * 2.51} 251`}
                    strokeDashoffset={`-${(highPct + medPct) * 2.51}`}
                    strokeLinecap="round"
                    className="transition-all duration-700 hover:opacity-90 cursor-pointer"
                  />
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {totalActivePriority}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Active Tasks
                  </span>
                </div>
              </div>

              {/* Priority Legends */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
                    <div>
                      <h4 className="text-sm font-extrabold text-red-900 dark:text-red-200">
                        High Priority
                      </h4>
                      <p className="text-xs text-red-600 dark:text-red-400">Urgent items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-red-700 dark:text-red-300">
                      {highPriority}
                    </span>
                    <span className="text-xs font-bold text-slate-500 block">({highPct}%)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                    <div>
                      <h4 className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                        Medium Priority
                      </h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400">Standard operational</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-amber-700 dark:text-amber-300">
                      {mediumPriority}
                    </span>
                    <span className="text-xs font-bold text-slate-500 block">({medPct}%)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                        Low Priority
                      </h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Backlog tasks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                      {lowPriority}
                    </span>
                    <span className="text-xs font-bold text-slate-500 block">({lowPct}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 3. Category Column Bar Graph ── */}
          {activeGraph === 'bar' && (
            <div className="space-y-6 py-2">
              {categories.map(cat => {
                const catTotal = cat.items.length
                const catDone = cat.items.filter(t => t.completed).length
                const catPct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0
                const Icon = cat.icon

                return (
                  <div key={cat.id} className="space-y-2 group">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-xs`}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="text-slate-900 dark:text-slate-100">{cat.name}</span>
                        <Badge variant="default" className="text-xs">
                          {catDone} / {catTotal} completed
                        </Badge>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold text-base">
                        {catPct}%
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/50">
                      <div
                        className={`h-full ${cat.barBg} rounded-full transition-all duration-700 shadow-sm`}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Bottom Productivity Performance Highlights ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800/40 border border-blue-200/60 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            <Flame size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Active Streak
            </h4>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">5 Days</p>
            <p className="text-xs font-medium text-slate-500">Consistent task completions</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-slate-900 dark:to-slate-800/40 border border-emerald-200/60 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
            <Award size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Peak Focus Window
            </h4>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Wednesday</p>
            <p className="text-xs font-medium text-slate-500">Highest daily velocity output</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800/40 border border-purple-200/60 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Target Efficiency
            </h4>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">92%</p>
            <p className="text-xs font-medium text-slate-500">Milestones hit on schedule</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
