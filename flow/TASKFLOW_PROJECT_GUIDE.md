# TaskFlow — Modern To-Do App

A modern, secure, 24/7 to-do web application for daily, weekly, and monthly task monitoring.

## Tech Stack

| Layer         | Technology                          | Cost    |
|---------------|-------------------------------------|---------|
| Frontend      | React 19 + Vite + TypeScript        | Free    |
| Styling       | Tailwind CSS v4                     | Free    |
| Icons         | lucide-react                        | Free    |
| Database      | Supabase (PostgreSQL + RLS)         | Free    |
| Auth          | Supabase Auth (50K MAU)            | Free    |
| Hosting       | Cloudflare Pages (global CDN)      | Free    |
| DNS           | Cloudflare DNS (auto SSL)          | Free    |
| Keep-Alive    | GitHub Actions cron                | Free    |
| **Total**     |                                     | **$0/mo** |

---

## 1. Supabase Setup

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com) → Sign up with GitHub
2. Click **New Project**
3. Fill in:
   - **Name:** `taskflow`
   - **Database Password:** generate a strong password, save it securely
   - **Region:** Singapore (closest to India)
   - **Plan:** Free
4. Wait 2-3 minutes for provisioning

### 1.2 Get API Keys

Navigate to **Settings → API**:

```
Project URL:     https://<your-project-ref>.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6... (safe for frontend)
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6... (NEVER expose in frontend)
```

> Store the `service_role` key only in server-side environments. Never commit it to Git.

### 1.3 Database Schema

Go to **SQL Editor** → **New Query** → paste and run:

```sql
-- ============================================
-- TaskFlow Database Schema
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('daily', 'weekly', 'monthly')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_category ON todos(user_id, category);
CREATE INDEX idx_todos_completed ON todos(user_id, completed);
CREATE INDEX idx_todos_due_date ON todos(user_id, due_date);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Todos policies
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Triggers
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_todos
  BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Realtime
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE todos;
```

### 1.4 Auth Configuration

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Settings:
   - **Confirm email:** ON
   - **Allow signup:** ON
   - **Email rate limit:** 4 per hour
4. (Optional) Enable **GitHub OAuth**:
   - Create OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
   - Callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret into Supabase
5. Set **Site URL** to your Cloudflare Pages domain: `https://your-app.pages.dev`
6. Add redirect URLs: `https://your-app.pages.dev/**`

---

## 2. 24/7 Keep-Alive (Critical for Free Tier)

> Supabase free projects **pause after 7 days of inactivity** [web:41][web:43].
> A scheduled ping every 5 days prevents this [web:46][web:53].
> Cloudflare Pages is always 24/7 (static CDN hosting, never pauses).

### 2.1 GitHub Actions Keep-Alive

Create `.github/workflows/keep-alive.yml` in your repo:

```yaml
name: Supabase Keep Alive

on:
  schedule:
    - cron: '0 6 */5 * *'  # Every 5 days at 6:00 UTC
  workflow_dispatch:        # Manual trigger

jobs:
  ping-supabase:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase Database
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
            -X GET "$SUPABASE_URL/rest/v1/todos?select=id&limit=1" \
            -H "apikey: $SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $SUPABASE_ANON_KEY")
          echo "Supabase ping response: $RESPONSE"
          if [ "$RESPONSE" != "200" ]; then
            echo "WARNING: Supabase returned $RESPONSE"
            exit 1
          fi
          echo "Supabase is active."
```

### 2.2 Add GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions**:

| Secret Name            | Value                                      |
|------------------------|--------------------------------------------|
| `SUPABASE_URL`         | `https://<project-ref>.supabase.co`        |
| `SUPABASE_ANON_KEY`    | Your anon public key                       |

### 2.3 Alternative: cron-job.org

If you prefer an external service:

1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create a job:
   - **URL:** `https://<project-ref>.supabase.co/rest/v1/todos?select=id&limit=1`
   - **Method:** GET
   - **Header:** `apikey: <anon-key>`
   - **Header:** `Authorization: Bearer <anon-key>`
   - **Schedule:** Every 5 days at 9:00 AM

### 2.4 Alternative: UptimeRobot

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free, 50 monitors)
2. Add HTTP monitor:
   - **URL:** `https://<project-ref>.supabase.co/rest/v1/todos?select=id&limit=1`
   - **Monitoring interval:** 5 days (or set to 24h for extra safety)
   - Add custom header: `apikey: <anon-key>`

---

## 3. Frontend Project Setup

### 3.1 Initialize Project

```bash
npm create vite@latest taskflow -- --template react-ts
cd taskflow
npm install
npm install @supabase/supabase-js
npm install lucide-react date-fns clsx
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-router-dom
npm install -D tailwindcss@4 @tailwindcss/vite
```

### 3.2 Configure Tailwind v4

`vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`src/index.css`:

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

### 3.3 Environment Variables

`.env.local` (NEVER commit this):

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 3.4 Supabase Client

`src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
```

### 3.5 Types

`src/types/index.ts`:

```typescript
export type TodoCategory = 'daily' | 'weekly' | 'monthly'
export type TodoPriority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  user_id: string
  title: string
  description: string
  category: TodoCategory
  priority: TodoPriority
  completed: boolean
  due_date: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  theme_preference: 'light' | 'dark'
  created_at: string
  updated_at: string
}
```

---

## 4. Project Structure

```
taskflow/
├── .github/
│   └── workflows/
│       └── keep-alive.yml          # Supabase 24/7 keep-alive
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── Layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── Todos/
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── TodoFilter.tsx
│   │   └── Dashboard/
│   │       ├── StatsCard.tsx
│   │       └── ProgressRing.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useTodos.ts
│   │   └── useAuth.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DailyPage.tsx
│   │   ├── WeeklyPage.tsx
│   │   ├── MonthlyPage.tsx
│   │   └── ProfilePage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local                       # Supabase keys (gitignored)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Core Components

### 5.1 Auth Context

`src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

### 5.2 Theme Context

`src/context/ThemeContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

### 5.3 Todo Hook with Realtime

`src/hooks/useTodos.ts`:

```typescript
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Todo, TodoCategory } from '../types'

export function useTodos(category: TodoCategory) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('category', category)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error)
      return
    }
    setTodos(data || [])
    setLoading(false)
  }, [category])

  useEffect(() => {
    fetchTodos()

    // Realtime subscription
    const channel = supabase
      .channel(`todos:${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `category=eq.${category}`,
        },
        () => fetchTodos()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchTodos, category])

  const addTodo = async (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('todos')
      .insert({ ...todo, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)

    if (error) throw error
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const { error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  return { todos, loading, addTodo, toggleTodo, updateTodo, deleteTodo, refetch: fetchTodos }
}
```

### 5.4 App Router

`src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Layout/Navbar'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import DailyPage from './pages/DailyPage'
import WeeklyPage from './pages/WeeklyPage'
import MonthlyPage from './pages/MonthlyPage'
import ProfilePage from './pages/ProfilePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/daily" element={<ProtectedRoute><DailyPage /></ProtectedRoute>} />
      <Route path="/weekly" element={<ProtectedRoute><WeeklyPage /></ProtectedRoute>} />
      <Route path="/monthly" element={<ProtectedRoute><MonthlyPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Navbar />
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
```

---

## 6. Cloudflare Pages Deployment

### 6.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: TaskFlow to-do app"
git branch -M main
git remote add origin https://github.com/<username>/taskflow.git
git push -u origin main
```

### 6.2 Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. Click **Create** → **Pages** → **Connect to Git**
3. Select your `taskflow` repository
4. Configure build:

| Setting               | Value              |
|-----------------------|--------------------|
| Production branch     | `main`             |
| Build command         | `npm run build`    |
| Build output directory| `dist`             |
| Root directory        | `/`                |

5. Add environment variables:

| Variable                 | Value                                      |
|--------------------------|--------------------------------------------|
| `VITE_SUPABASE_URL`     | `https://<project-ref>.supabase.co`        |
| `VITE_SUPABASE_ANON_KEY`| Your anon public key                       |

6. Click **Save and Deploy**
7. Wait 1-2 minutes → your app is live at `https://taskflow.pages.dev`

### 6.3 Deploy via CLI (Alternative)

```bash
npm run build
npx wrangler pages deploy dist --project-name=taskflow
```

### 6.4 Custom Domain & DNS

If you have a custom domain:

1. In Cloudflare Dashboard → **Workers & Pages** → select `taskflow`
2. Go to **Custom domains** → **Set up a custom domain**
3. Enter your domain (e.g., `todos.yourdomain.com`)
4. If your domain uses **Cloudflare DNS**, the CNAME is created automatically
5. If using another DNS provider, add manually:

| Record Type | Name  | Target                        | TTL  |
|-------------|-------|-------------------------------|------|
| CNAME       | `www` | `taskflow.pages.dev`           | Auto |
| CNAME       | `@`   | `taskflow.pages.dev` (flattened) | Auto |

6. SSL is automatic — no manual certificate needed

### 6.5 Update Supabase Redirect URLs

After deployment, update Supabase Auth URLs:

1. Supabase Dashboard → **Authentication → URL Configuration**
2. **Site URL:** `https://taskflow.pages.dev` (or your custom domain)
3. **Redirect URLs:** Add `https://taskflow.pages.dev/**`

---

## 7. Security Checklist

- [ ] `service_role` key never appears in frontend code
- [ ] `.env.local` is in `.gitignore`
- [ ] RLS enabled on ALL tables
- [ ] RLS policies scope data to `auth.uid()`
- [ ] Email confirmation enabled in Supabase Auth
- [ ] Supabase Auth URL configured to production domain
- [ ] Cloudflare SSL (automatic) active on custom domain
- [ ] GitHub Actions secrets used for Supabase keys (not hardcoded)
- [ ] No sensitive keys committed to Git repository
- [ ] Database CHECK constraints on category and priority fields
- [ ] Rate limiting via Supabase Auth (4 emails/hour)

---

## 8. Free Tier Limits & 24/7 Guarantee

### Cloudflare Pages (Always 24/7)

| Resource             | Free Limit          |
|----------------------|---------------------|
| Builds               | 500/month           |
| Requests             | Unlimited           |
| Bandwidth            | Unlimited           |
| Concurrent builds    | 1                   |
| Preview deployments  | Unlimited           |

Cloudflare Pages is **static hosting on a global CDN** — it never pauses, sleeps, or goes offline [web:28][web:32].

### Supabase Free Tier (24/7 with Keep-Alive)

| Resource             | Free Limit          |
|----------------------|---------------------|
| Database             | 500 MB PostgreSQL   |
| Auth users           | 50,000 MAU          |
| Storage              | 1 GB                |
| Bandwidth            | 5 GB/month          |
| Edge Functions       | 500K invocations/mo |
| Active projects      | 2                   |
| **Auto-pause**       | **After 7 days idle** |

Supabase free projects pause after 7 days without database activity [web:41][web:43][web:45]. The GitHub Actions keep-alive (Section 2) sends a database query every 5 days, resetting the inactivity timer and ensuring 24/7 availability [web:46][web:53].

> If paused: log into Supabase Dashboard → click **Restore Project**. Data is retained for 90 days after pausing [web:43][web:49].

### Backup Warning

Free tier has **0 days backup retention** [web:49]. For data safety, set up periodic exports:

```bash
# Manual backup script (run weekly)
pg_dump "postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres" \
  --no-owner --no-privileges -F c -f backup_$(date +%Y%m%d).dump
```

---

## 9. Modern Features

| Feature              | Library / Method              |
|----------------------|-------------------------------|
| Dark/Light theme     | Tailwind v4 `dark:` + localStorage |
| Drag-and-drop reorder| @dnd-kit/core + @dnd-kit/sortable |
| Real-time sync       | Supabase realtime channels    |
| Date formatting      | date-fns                     |
| Icons                | lucide-react                 |
| Priority badges      | Color-coded (red/yellow/green) |
| Category tabs        | Daily / Weekly / Monthly      |
| Progress dashboard   | Completion stats per category |
| OAuth login          | GitHub (optional)             |
| Responsive design    | Tailwind mobile-first         |

---

## 10. Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Cloudflare Pages
npm run build && npx wrangler pages deploy dist

# Type check
npx tsc --noEmit
```

---

## 11. Quick Start Checklist

1. [ ] Create Supabase project, run SQL schema (Section 1.3)
2. [ ] Configure Supabase Auth providers (Section 1.4)
3. [ ] Initialize React project, install dependencies (Section 3.1)
4. [ ] Create `.env.local` with Supabase keys (Section 3.3)
5. [ ] Build all components (Section 5)
6. [ ] Push to GitHub
7. [ ] Add GitHub Actions keep-alive workflow + secrets (Section 2)
8. [ ] Deploy to Cloudflare Pages (Section 6.2)
9. [ ] Update Supabase Auth redirect URLs (Section 6.5)
10. [ ] (Optional) Connect custom domain (Section 6.4)
11. [ ] Run through security checklist (Section 7)

---

## Tech Stack Summary

```
Frontend:   React 19 + Vite + TypeScript + Tailwind CSS v4
Backend:    Supabase (PostgreSQL + Auth + Realtime + RLS)
Hosting:    Cloudflare Pages (free, unlimited bandwidth, 24/7)
DNS:        Cloudflare DNS (automatic SSL, CNAME flattening)
Keep-Alive: GitHub Actions cron (every 5 days)
Cost:       $0/month
```
