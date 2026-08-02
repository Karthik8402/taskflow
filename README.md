<div align="center">
  <img src="https://img.shields.io/badge/TaskFlow-v1.0.0-2563eb?style=for-the-badge&logo=checkmarx&logoColor=white" alt="TaskFlow" />
  <br/><br/>

  <h1>TaskFlow</h1>
  <p><strong>A modern, production-quality task management SaaS application</strong></p>
  <p>Built with React 19, Vite, TypeScript, Tailwind CSS v4, and Supabase</p>

  <br/>

  [![CI](https://github.com/Karthik8402/taskflow/actions/workflows/ci.yml/badge.svg)](https://github.com/Karthik8402/taskflow/actions/workflows/ci.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)

</div>

---

## ✨ Features

- **Task Categorization** — Organize tasks into **Daily**, **Weekly**, and **Monthly** cycles
- **Priority Management** — Three-tier priority system (High / Medium / Low) with clear visual indicators
- **Drag & Drop Reordering** — Reorder tasks intuitively via `@dnd-kit`
- **Analytics Dashboard** — Real-time productivity metrics, completion rates, and priority distribution charts
- **Full Authentication** — Separate sign-in, sign-up, forgot password, and password reset flows via Supabase Auth
- **Guest / Demo Mode** — Try the full app without creating an account
- **Dark Mode** — System-aware dark/light theme toggle with persistence
- **Responsive Design** — Desktop sidebar + mobile bottom navigation bar
- **Real-time Sync** — Live task synchronization via Supabase Realtime (when connected)
- **Offline/Demo Fallback** — Works fully in browser local storage when Supabase is not configured
- **Data Export** — Download a full JSON backup of all task data
- **Row Level Security** — All data is isolated per user at the PostgreSQL level

---

## 🛡️ Security

- **No hardcoded credentials** — All secrets are loaded from environment variables only
- **Row Level Security (RLS)** enforced on all Supabase tables
- **Safe error messages** — Backend errors are mapped to user-friendly messages (no stack traces exposed)
- **Password validation** — Client-side enforcement of minimum 8 character length
- **Password visibility toggle** — Accessible show/hide password on auth forms
- **Delete confirmation** — All destructive actions require explicit modal confirmation
- **Redirect allowlist** — Internal redirect validation to prevent open redirect attacks
- **No secrets in `.env.local`** tracked by git — `.env.local` is excluded in `.gitignore`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) v10+
- A [Supabase](https://supabase.com/) project (optional — app runs in Demo Mode without it)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Karthik8402/taskflow.git
cd taskflow

# 2. Install dependencies
npm install

# 3. Copy the environment example
cp .env.example .env.local

# 4. Fill in your Supabase credentials (optional — skip for Demo Mode)
# Edit .env.local:
# VITE_SUPABASE_URL=https://your-project-ref.supabase.co
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# 5. Start the development server
npm run dev
```

### Database Setup (Supabase)

If connecting to Supabase, apply the schema to your project:

1. Open your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **SQL Editor**
3. Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql)

This creates the `profiles` and `todos` tables, indexes, RLS policies, and realtime configuration.

---

## 📖 Usage

| Route | Description |
|---|---|
| `/` | Productivity Dashboard — all tasks + category rings |
| `/daily` | Daily Tasks workspace |
| `/weekly` | Weekly Goals workspace |
| `/monthly` | Monthly Targets workspace |
| `/analytics` | Analytics — completion rates, category breakdown, priority stats |
| `/settings` | Theme preferences, data export, connection status |
| `/profile` | Account overview |
| `/notifications` | Notifications hub *(coming soon)* |
| `/help` | Help & Documentation *(coming soon)* |
| `/auth/sign-in` | Sign In |
| `/auth/sign-up` | Create Account |
| `/auth/forgot-password` | Password Reset Request |
| `/auth/reset-password` | Set New Password |

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── layout/          # AppShell, Navbar, Sidebar, MobileBottomNav, DemoBanner
│   ├── Dashboard/       # ProgressRing, StatsCard
│   ├── Todos/           # TodoItem, TodoList, TodoFilter, TodoFormModal
│   ├── tasks/           # Shared TaskListPage (replaces duplicate category pages)
│   └── ui/              # 18 reusable design system primitives
├── context/             # AuthContext, ThemeContext, ToastContext
├── hooks/               # useTodos (task CRUD + realtime)
├── lib/                 # supabase.ts, validation.ts
├── pages/               # DashboardPage, AnalyticsPage, SettingsPage, ProfilePage
│   └── auth/            # SignInPage, SignUpPage, ForgotPasswordPage, ResetPasswordPage
├── styles/              # tokens.css (design system tokens)
├── test/                # setup.ts (Vitest + testing-library config)
└── types/               # database.types.ts, index.ts
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v4 + CSS Custom Properties (design tokens) |
| **Routing** | React Router v7 |
| **Backend / DB** | Supabase (PostgreSQL + RLS + Realtime + Auth) |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable |
| **Icons** | Lucide React |
| **Dates** | date-fns |
| **Testing** | Vitest + @testing-library/react + jsdom |
| **Linting** | ESLint v10 + typescript-eslint + eslint-plugin-react-hooks |
| **CI/CD** | GitHub Actions (lint → typecheck → test → build → audit) |
| **Deployment** | Cloudflare Workers (via `wrangler.json`) |

---

## 🧪 Development Scripts

```bash
# Start local development server
npm run dev

# Type check (no emit)
npm run typecheck

# Lint (ESLint flat config)
npm run lint

# Run unit & component tests
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Production build
npm run build

# Preview production build locally
npm run preview

# Generate Supabase TypeScript types (requires SUPABASE_PROJECT_ID env var)
npm run gen:types
```

---

## 🔄 CI/CD Pipeline

GitHub Actions runs on every push and pull request to `main`:

1. **Quality** — lint + typecheck + test coverage
2. **Build** — production bundle verification
3. **Security** — `npm audit --audit-level=high`

**Dependabot** is configured for weekly npm dependency updates (dev dependencies grouped).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with a clear message: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

Please ensure all CI checks pass before requesting a review.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Karthik8402">Karthik</a></sub>
</div>
