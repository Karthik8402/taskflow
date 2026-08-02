import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { ChevronDown, Keyboard, Sparkles, Clock, Calendar } from 'lucide-react'

export function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const shortcuts = [
    { key: 'N', description: 'Open New Task Modal anywhere in the app' },
    { key: 'Esc', description: 'Close any active Modal, DatePicker, or Dropdown' },
    { key: '↑ / ↓', description: 'Navigate PrioritySelect choices or Dropdown items' },
    { key: 'Tab', description: 'Move focus forward across form fields' },
    { key: 'Shift + Tab', description: 'Move focus backward across form fields' },
  ]

  const faqs = [
    {
      q: 'What is the difference between Daily, Weekly, and Monthly cycles?',
      a: 'Daily tasks focus on immediate high-impact actions for today. Weekly goals track medium-term milestones over 7 days. Monthly targets are strategic long-term objectives for the month.',
    },
    {
      q: 'How does Guest Mode work?',
      a: 'Guest Mode stores all your task data locally inside browser storage with a 7-day TTL. You can upgrade to a free account anytime to sync data with Supabase PostgreSQL cloud.',
    },
    {
      q: 'Is my task data secure?',
      a: 'Yes! When connected to Supabase, Row Level Security (RLS) policies enforce database-level isolation ensuring your task items are accessible only by your authenticated account.',
    },
    {
      q: 'How do I export a JSON backup of my tasks?',
      a: 'Navigate to the Settings page and click "Export JSON Backup". This downloads a sanitized JSON file containing all your task titles, categories, priorities, and deadlines.',
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <PageHeader
        title="Help & Documentation"
        description="Comprehensive user guide, keyboard shortcut cheatsheet, and workspace FAQs."
      />

      {/* ── Keyboard Shortcuts Reference ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="text-blue-500" size={20} />
            <span>Keyboard Shortcuts Cheatsheet</span>
          </CardTitle>
          <CardDescription>
            Boost your productivity with quick keyboard commands.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shortcuts.map((sc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {sc.description}
                </span>
                <kbd className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold shadow-xs text-blue-600 dark:text-blue-400">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Workflow Strategy Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <h3 className="text-base font-bold">1. Daily Execution</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Keep your daily list under 7 items to maintain focus. Drag to reorder tasks by urgency.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <h3 className="text-base font-bold">2. Weekly Milestones</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Review weekly progress ring completion rates every Monday to adjust work velocity.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <h3 className="text-base font-bold">3. Monthly Targets</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Align big picture targets and export JSON backups regularly to keep data safe.
          </p>
        </Card>
      </div>

      {/* ── FAQ Section ── */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common answers to workspace and account questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
