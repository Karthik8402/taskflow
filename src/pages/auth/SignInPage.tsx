import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAuthErrorMessage } from '../../lib/validation'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { AuthHeader } from '../../components/layout/AuthHeader'
import { CheckCircle2, Play, ArrowRight, Eye, EyeOff } from 'lucide-react'

export function SignInPage() {
  const navigate = useNavigate()
  const { signIn, enableGuestMode } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setErrorMsg(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleLaunchGuest = () => {
    enableGuestMode()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-600/20">
              <CheckCircle2 size={28} className="stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Sign in to TaskFlow
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back! Access your synchronized task dashboard.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5 shadow-xs">
            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="current-password"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="text-right pt-1">
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                <span>Sign In</span>
                <ArrowRight size={16} />
              </Button>
            </form>

            <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/auth/sign-up"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Guest Demo CTA */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={handleLaunchGuest}
                className="w-full justify-center"
              >
                <Play size={14} className="text-amber-500" />
                <span>Launch Demo Mode</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
