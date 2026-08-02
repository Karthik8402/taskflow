import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { LogOut, ShieldCheck, Info } from 'lucide-react'

export function ProfilePage() {
  const { user, isGuest, signOut } = useAuth()

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Account Settings" description="View and manage your account credentials." />

      <Card>
        <CardHeader>
          <CardTitle>User Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-600/20">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'TaskFlow User'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {isGuest ? (
                    <Badge variant="warning">
                      <Info size={12} />
                      <span>Demo Mode</span>
                    </Badge>
                  ) : (
                    <Badge variant="success">
                      <ShieldCheck size={12} />
                      <span>Authenticated</span>
                    </Badge>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {user?.id?.substring(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            <Button variant="destructive" size="sm" onClick={() => signOut()}>
              <LogOut size={14} />
              <span>{isGuest ? 'Exit Demo' : 'Sign Out'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
