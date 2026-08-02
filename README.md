<div align="center">
  <img src="https://img.shields.io/badge/TaskFlow-v2.0-2563eb?style=for-the-badge&logo=checkmarx&logoColor=white" alt="TaskFlow" />
  <br/><br/>

  <h1>TaskFlow SaaS 2.0</h1>
  <p><strong>Next-Gen Productivity Workspace & Intelligent Task Management Application</strong></p>
  <p>Built with React 19, Vite, TypeScript 5.7, Tailwind CSS v4, and Supabase PostgreSQL</p>

  <br/>

  [![CI](https://github.com/Karthik8402/taskflow/actions/workflows/ci.yml/badge.svg)](https://github.com/Karthik8402/taskflow/actions/workflows/ci.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)

</div>

---

## 🔗 Live Links

- **Production App**: [https://todo.karthikdev.app](https://todo.karthikdev.app)
- **GitHub Repository**: [https://github.com/Karthik8402/taskflow](https://github.com/Karthik8402/taskflow)

---

## ✨ Key Features & UX Highlights

- **3-Time-Cycle Focus Windows** — Categorize work into **Daily Actions** ☀️, **Weekly Milestones** 🗓️, and **Monthly Targets** 🎯.
- **Glassmorphic Public Landing Page** — Showcase hero banner, interactive mock dashboard, features, testimonials, FAQ accordion, and pricing CTAs (`/` and `/landing`).
- **Interactive Analytics Graphs** — Switch dynamically between:
  - 📈 **Velocity Area Curve**: Bezier trend chart with hover tooltips and daily completion percentages.
  - 🍩 **Priority Donut Chart**: High/Medium/Low priority distribution with percentage legends.
  - 📊 **Category Column Bars**: Comparative completion progress across time windows.
- **Custom UI Controls** — Built-in custom `DatePicker` calendar and `PrioritySelect` selector with color badges and keyboard shortcuts (`↑`/`↓`/`Esc`).
- **Theme-Aware Toast Notifications** — Animated notifications with Light and Dark mode styling and colored left accent bars.
- **Auth Header Navigation** — Dedicated `AuthHeader` bar across Sign In, Sign Up, Forgot Password, and Reset Password pages with brand logo, Theme Toggle, and "← Home" link.
- **Dynamic Route Titles** — Automatic document title updates (`PageTitleManager` & `useDocumentTitle`) for SEO and tab navigation.
- **Drag & Drop Reordering** — Smooth task prioritization powered by `@dnd-kit`.
- **Instant Guest / Demo Mode** — Full task management using browser `localStorage` without requiring sign-up or Supabase credentials.
- **Bank-Grade Security** — PostgreSQL Row Level Security (RLS) policies guaranteeing strict multi-tenant data isolation.
- **JSON Data Export** — Instant backup export of all tasks and user settings.

---

## 🛡️ Security & Quality Guarantees

- **No Public Credentials Exposed** — All backend keys loaded exclusively from environment variables (`.env.local`).
- **Row Level Security (RLS)** — Database rules restrict task queries strictly to `auth.uid() = user_id`.
- **Input & Auth Sanitization** — Password strength validation and user-friendly error mapping without stack traces.
- **Modal Popover Positioning** — Relative popup containment preventing UI clipping in modals.
- **No-Secret Git Protection** — `.env.local` and sensitive files enforced in `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) v10+
- A [Supabase](https://supabase.com/) project (optional — app runs in Guest/Demo mode without it)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Karthik8402/taskflow.git
cd taskflow

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Fill in your Supabase credentials (optional for cloud sync)
# Edit .env.local:
# VITE_SUPABASE_URL=https://your-project-ref.supabase.co
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# 5. Start the development server
npm run dev
```

### Database Setup (Supabase SQL Schema)

To connect your own Supabase instance:
1. Open your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **SQL Editor**
3. Execute the schema script located at [`supabase/schema.sql`](supabase/schema.sql)

---

## 📖 Route Map

| Path | Page Component | Description |
|---|---|---|
| `/` | `LandingPage.tsx` | Glassmorphic Public SaaS Landing Page |
| `/landing` | `LandingPage.tsx` | Public Landing Page alias |
| `/dashboard` | `DashboardPage.tsx` | Main SaaS Workspace & Progress Rings |
| `/tasks` | `TaskListPage.tsx` | Portfolio view of all tasks |
| `/daily` | `TaskListPage.tsx` | Daily Actions workspace |
| `/weekly` | `TaskListPage.tsx` | Weekly Goals workspace |
| `/monthly` | `TaskListPage.tsx` | Monthly Targets workspace |
| `/analytics` | `AnalyticsPage.tsx` | Interactive Velocity, Donut & Bar Analytics |
| `/settings` | `SettingsPage.tsx` | Theme, JSON Backup & Connection Status |
| `/profile` | `ProfilePage.tsx` | Profile Overview & Preferences |
| `/notifications` | `NotificationsPage.tsx` | Notifications Center |
| `/help` | `HelpPage.tsx` | Help & FAQ Center |
| `/auth/sign-in` | `SignInPage.tsx` | User Sign In |
| `/auth/sign-up` | `SignUpPage.tsx` | Account Registration |
| `/auth/forgot-password` | `ForgotPasswordPage.tsx` | Password Recovery Request |
| `/auth/reset-password` | `ResetPasswordPage.tsx` | Set New Password |

---

## 🏗️ Architecture & Project Structure

```text
taskflow/
├── .github/
│   ├── workflows/ci.yml         # 3-Stage Parallel CI Pipeline
│   └── dependabot.yml           # Weekly Dependency Updates
├── supabase/
│   └── schema.sql               # PostgreSQL RLS & Table Definitions
├── src/
│   ├── components/
│   │   ├── layout/              # AppShell, AuthHeader, Navbar, Sidebar, MobileBottomNav
│   │   ├── Dashboard/           # ProgressRing, StatsCard
│   │   ├── Todos/               # TodoItem, TodoList, TodoFilter, TodoFormModal
│   │   ├── tasks/               # Shared TaskListPage component
│   │   └── ui/                  # DatePicker, PrioritySelect, Modal, Button, Card, Toast...
│   ├── context/                 # AuthContext, ThemeContext, ToastContext
│   ├── hooks/                   # useTodos, useDocumentTitle
│   ├── lib/                     # supabase.ts, validation.ts
│   ├── pages/                   # LandingPage, DashboardPage, AnalyticsPage, SettingsPage...
│   │   └── auth/                # SignInPage, SignUpPage, ForgotPasswordPage, ResetPasswordPage
│   ├── test/                    # Setup & Vitest test mocks
│   └── types/                   # database.types.ts, index.ts
├── index.html                   # HTML Entry point
├── vitest.config.ts             # Vitest & happy-dom Configuration
└── wrangler.json                # Cloudflare SPA Deployment Config
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v4 + Design Tokens (`index.css`) |
| **Routing** | React Router v7 |
| **Backend & DB** | Supabase (PostgreSQL + RLS + Realtime + Auth) |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` |
| **Testing** | Vitest 4 + `@testing-library/react` + `happy-dom` |
| **Linting** | ESLint v10 + `typescript-eslint` |
| **CI/CD** | GitHub Actions (Parallel Quality Gates → Build → Security Audit) |
| **Deployment** | Cloudflare Workers / Pages |

---

## 🧪 Available Scripts

```bash
# Start local development server
npm run dev

# TypeScript type checking
npm run typecheck

# ESLint check
npm run lint

# Run unit tests
npm run test:run

# Run unit tests with V8 coverage report
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Karthik8402">Karthik</a></sub>
</div>
