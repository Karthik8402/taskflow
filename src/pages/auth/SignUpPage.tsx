import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { validatePassword, getAuthErrorMessage } from '../../lib/validation'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function SignUpPage() {
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setErrorMsg(passwordValidation.message || 'Password too short.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await signUp(email, password)
      setSuccessMsg('Account created successfully! Please check your email inbox to verify your address.')
    } catch (err) {
      setErrorMsg(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const passwordLength = password.length
  const hasMinLength = passwordLength >= 8

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090D16]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-600/20">
            <CheckCircle2 size={28} className="stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create your TaskFlow Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Get started with real-time cloud synchronization.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5 shadow-xs">
          {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {/* Password strength helper */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                <div
                  className={`h-1 flex-1 rounded-full ${
                    hasMinLength ? 'bg-emerald-500' : passwordLength > 0 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                <span className="text-slate-500 dark:text-slate-400">
                  {hasMinLength ? 'Sufficient length' : 'Min 8 chars'}
                </span>
              </div>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              <span>Sign Up</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/auth/sign-in"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
