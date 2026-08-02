import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { AppShell } from './components/layout/AppShell'
import { Spinner } from './components/ui/Spinner'

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

function AuthenticatedApp() {
  return (
    <AppShell>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskListPage
                category="all"
                title="All Tasks"
                description="Manage and filter your entire task portfolio across categories."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily"
          element={
            <ProtectedRoute>
              <TaskListPage
                category="daily"
                title="Daily Tasks"
                description="Focus on high-impact actions and daily habit execution."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weekly"
          element={
            <ProtectedRoute>
              <TaskListPage
                category="weekly"
                title="Weekly Goals"
                description="Medium-term milestone objectives for the current week."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monthly"
          element={
            <ProtectedRoute>
              <TaskListPage
                category="monthly"
                title="Monthly Targets"
                description="Strategic long-term targets for the current month."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<Navigate to="/auth/sign-in" replace />} />
              <Route path="/auth/sign-in" element={<SignInPage />} />
              <Route path="/auth/sign-up" element={<SignUpPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

              {/* Main Authenticated Layout Routes */}
              <Route path="/*" element={<AuthenticatedApp />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
