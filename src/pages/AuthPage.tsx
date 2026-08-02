import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, Lock, Mail, ArrowRight, Play, Sparkles } from 'lucide-react'

export function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, enableGuestMode, isLiveSupabase } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      if (isSignUp) {
        await signUp(email, password)
        setSuccessMsg('Account created! Please check your email for verification link.')
      } else {
        await signIn(email, password)
        navigate('/')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLaunchGuest = () => {
    enableGuestMode()
    navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
            <CheckCircle2 size={32} className="stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {isSignUp ? 'Create your TaskFlow Account' : 'Welcome back to TaskFlow'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isSignUp
              ? 'Secure 24/7 task monitoring powered by Supabase'
              : 'Sign in to access your synchronized task dashboard'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-gray-200 dark:border-gray-800 shadow-xl">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-800/80">
            <button
              onClick={() => {
                setIsSignUp(prev => !prev)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Quick Demo Mode Launcher */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 text-center space-y-3">
            <div className="flex items-center gap-2 justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Sparkles size={14} className="text-amber-500" />
              <span>Want to explore without signing in?</span>
            </div>
            <button
              onClick={handleLaunchGuest}
              className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play size={14} />
              <span>Launch Demo Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
