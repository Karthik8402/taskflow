import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Sparkles,
  Clock,
  Calendar,
  BarChart2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  Sun,
  Moon,
  Star,
  Smartphone,
  Layers,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Is TaskFlow completely free to use?',
      a: 'Yes! TaskFlow offers a full-featured Guest/Demo mode that works offline with browser local storage. You can upgrade to a free account anytime for cloud sync.',
    },
    {
      q: 'How does the Daily, Weekly, and Monthly cycle system work?',
      a: 'TaskFlow categorizes your tasks into 3 distinct focus windows: Daily tasks for immediate action, Weekly goals for medium-term milestones, and Monthly targets for strategic execution.',
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We enforce Row Level Security (RLS) at the PostgreSQL database layer, ensuring your data is isolated and accessible only by you.',
    },
    {
      q: 'Can I export my data?',
      a: 'Yes, you can export a full JSON backup of all your tasks and profile preferences from the Settings page at any time.',
    },
  ]

  const features = [
    {
      icon: Clock,
      title: 'Actionable Time Cycles',
      description: 'Break big ambitions into Daily, Weekly, and Monthly manageable action steps.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart2,
      title: 'Real-time Analytics',
      description: 'Track completion trends, velocity metrics, and priority distributions visually.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Layers,
      title: 'Drag & Drop Flow',
      description: 'Intuitively reorder and prioritize tasks with smooth drag-and-drop interactions.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade RLS Security',
      description: 'Your data is strictly isolated with PostgreSQL Row-Level Security policies.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Smartphone,
      title: 'Fully Responsive',
      description: 'Seamless experience on mobile, tablet, and desktop with dark mode support.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Zap,
      title: 'Instant Guest Mode',
      description: 'Start managing tasks immediately without creating an account or providing email.',
      color: 'from-blue-600 to-violet-600',
    },
  ]

  const testimonials = [
    {
      name: 'Alex Rivera',
      role: 'Senior Software Engineer',
      text: 'TaskFlow replaced 3 separate tools for me. The 3-cycle system keeps me focused on what matters today.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      text: 'The analytics dashboard gives me visual clarity on team output. Incredible UI/UX!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'Startup Founder',
      text: 'Fast, crisp, and dark mode looks stunning. Best todo app I have used in years.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-500 selection:text-white">
      {/* ── Navigation Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <RouterLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <CheckCircle2 size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 dark:from-white dark:via-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest -mt-1">
                SaaS
              </span>
            </div>
          </RouterLink>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <RouterLink
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Go to Workspace</span>
                <ArrowRight size={14} />
              </RouterLink>
            ) : (
              <>
                <RouterLink
                  to="/auth/sign-in"
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/auth/sign-up"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={14} />
                </RouterLink>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-bold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-3">
            <Sparkles size={14} className="text-blue-500 animate-pulse" />
            <span>TaskFlow 2.0 — Next-Gen Productivity Workspace</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Master your priorities with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              intelligent task cycles
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Organize daily tasks, weekly milestones, and monthly strategic targets with real-time sync, visual analytics, and drag-and-drop simplicity.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/auth/sign-up')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{user ? 'Open Your Workspace' : 'Start Free Workspace'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#preview"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              Explore Features
            </a>
          </div>

          {/* Micro Social Proof */}
          <div className="mt-10 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-2">
              {testimonials.map((t, idx) => (
                <img
                  key={idx}
                  src={t.avatar}
                  alt={t.name}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-[#090D16] object-cover"
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">4.9/5</span>
              <span>from 10k+ productive users</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Interactive Showcase ── */}
      <section id="preview" className="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Designed for Speed & Focus
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything you need to execute efficiently every single day
            </p>
          </div>

          {/* Interactive Mock Dashboard */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 md:p-8 overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">TaskFlow Dashboard v2.0</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Supabase Live Sync</span>
              </div>
            </div>

            {/* Content grid preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Category Ring Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center text-center">
                <Clock size={22} className="text-blue-500 mb-2" />
                <span className="text-xs font-bold">Daily Tasks</span>
                <div className="w-24 h-24 my-3 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center font-extrabold text-lg text-blue-600 dark:text-blue-400">
                  85%
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">6 of 7 tasks done today</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center text-center">
                <Calendar size={22} className="text-cyan-500 mb-2" />
                <span className="text-xs font-bold">Weekly Goals</span>
                <div className="w-24 h-24 my-3 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 flex items-center justify-center font-extrabold text-lg text-cyan-600 dark:text-cyan-400">
                  62%
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">8 of 13 milestones</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center text-center">
                <Sparkles size={22} className="text-purple-500 mb-2" />
                <span className="text-xs font-bold">Monthly Targets</span>
                <div className="w-24 h-24 my-3 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex items-center justify-center font-extrabold text-lg text-purple-600 dark:text-purple-400">
                  45%
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">5 of 11 objectives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid ── */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need for peak productivity
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            Built with modern architecture to make managing tasks effortless, secure, and beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Loved by Professionals</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              See what creators and engineers say about TaskFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section id="pricing" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-700 p-8 sm:p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to transform your task management?
            </h2>
            <p className="mt-4 text-sm text-blue-100 font-medium">
              Join thousands of users organizing daily actions, weekly milestones, and monthly targets with TaskFlow today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/auth/sign-up')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-blue-600 bg-white hover:bg-slate-100 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{user ? 'Go to Dashboard' : 'Get Started for Free'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <CheckCircle2 size={16} />
            </div>
            <span className="font-bold text-sm">TaskFlow SaaS</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            © 2026 TaskFlow. All rights reserved. Built with React 19, TypeScript & Supabase.
          </p>
        </div>
      </footer>
    </div>
  )
}
