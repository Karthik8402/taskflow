import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { AppShell } from './components/layout/AppShell'
import { Spinner } from './components/ui/Spinner'

import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'

import { DashboardPage } from './pages/DashboardPage'
import { TaskListPage } from './components/tasks/TaskListPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { HelpPage } from './pages/HelpPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090D16]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            Loading TaskFlow...
          </span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return <>{children}</>
}

function AuthenticatedWorkspace() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="tasks"
            element={
              <TaskListPage
                category="all"
                title="All Tasks"
                description="Manage and filter your entire task portfolio across categories."
              />
            }
          />
          <Route
            path="daily"
            element={
              <TaskListPage
                category="daily"
                title="Daily Tasks"
                description="Focus on high-impact actions and daily habit execution."
              />
            }
          />
          <Route
            path="weekly"
            element={
              <TaskListPage
                category="weekly"
                title="Weekly Goals"
                description="Medium-term milestone objectives for the current week."
              />
            }
          />
          <Route
            path="monthly"
            element={
              <TaskListPage
                category="monthly"
                title="Monthly Targets"
                description="Strategic long-term targets for the current month."
              />
            }
          />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing & Home */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />

              {/* Authentication Routes */}
              <Route path="/auth" element={<Navigate to="/auth/sign-in" replace />} />
              <Route path="/auth/sign-in" element={<SignInPage />} />
              <Route path="/auth/sign-up" element={<SignUpPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

              {/* Main Authenticated SaaS Workspace App Routes */}
              <Route path="/*" element={<AuthenticatedWorkspace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
