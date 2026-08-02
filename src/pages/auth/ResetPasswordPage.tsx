import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { validatePassword, getAuthErrorMessage } from '../../lib/validation'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { AuthHeader } from '../../components/layout/AuthHeader'
import { CheckCircle2 } from 'lucide-react'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const validation = validatePassword(password)
    if (!validation.valid) {
      setErrorMsg(validation.message || 'Password invalid.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
      }
      setSuccessMsg('Your password has been updated! Redirecting to sign in...')
      setTimeout(() => {
        navigate('/auth/sign-in')
      }, 2000)
    } catch (err) {
      setErrorMsg(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-600/20">
              <CheckCircle2 size={28} className="stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Set New Password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please enter your new security credentials below.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5 shadow-xs">
            {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                minLength={8}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
