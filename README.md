# TriageFlow — Frontend

React 19 SPA for AI-assisted medical triage. Built with Vite 8, TypeScript 6, Tailwind CSS 4, and TanStack React Query. Provides the patient interview UI, admin dashboard, and authentication flow.

> **Project Status:** Portfolio demo — 2-week development showcase. All data is synthetic. Not for medical use.

## Prerequisites

- **Node.js** 20+ (tested with 22+)
- **npm** 10+ or **pnpm** 9+
- Backend API running — see [triageflow-backend](https://github.com/psswid/triageflow-backend)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set environment (defaults work with local backend)
#    Edit .env only if your backend is at a different URL
#    VITE_API_URL=http://localhost:8000

# 3. Start the dev server
npm run dev
```

The app opens at `http://localhost:5173`.

### From Scratch (All Commands)

```bash
git clone git@github.com:psswid/triageflow-frontend.git
cd triageflow-frontend
npm install
cp .env.example .env       # If .env doesn't exist (not tracked in git)
                           # Creates VITE_API_URL=http://localhost:8000
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server at `:5173` with HMR |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript type checking (`tsc -b --noEmit`) |
| `npm run lint` | ESLint across `src/` |
| `npx playwright test` | Run E2E tests (requires Docker backend) |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

Create a `.env` file (not tracked in git) or `.env.local` to override:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── api/
│   ├── client.ts            # Axios instance with JWT interceptor
│   ├── endpoints.ts         # API endpoint functions
│   ├── types.ts             # TypeScript types matching backend resources
│   └── __tests__/
│       └── types.test.ts    # Type-level tests for API types
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx  # Auth context provider
│   │   └── ProtectedRoute.tsx # Route guard for authenticated users
│   ├── layout/
│   │   ├── AppLayout.tsx     # Main layout with header/footer
│   │   └── AdminRoute.tsx    # Route guard for admin users
│   ├── shared/               # Shared UI components
│   │   ├── RouteErrorFallback.tsx
│   │   └── NotFoundPage.tsx
│   └── ui/                   # Base UI primitives
├── features/
│   ├── triage/               # Symptom interview & results
│   │   └── pages/
│   │       ├── TriagePage.tsx
│   │       └── TriageResultPage.tsx
│   ├── auth/                 # Login & registration
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   ├── submissions/          # User's submission history
│   │   └── pages/
│   │       └── MySubmissionsPage.tsx
│   └── admin/                # Admin dashboard
│       └── pages/
│           ├── DashboardPage.tsx
│           ├── SubmissionDetailPage.tsx
│           └── UsersPage.tsx
├── hooks/
│   └── useAuth.ts            # Auth state hook
├── styles/                   # Global styles (Tailwind imports)
├── test/                     # Vitest test files
│   ├── setup.ts              # Test setup (@testing-library/jest-dom)
│   ├── admin/                # Admin component tests
│   └── triage/               # Triage component tests
├── e2e/                      # Playwright E2E tests
│   └── basic.spec.ts
├── App.tsx                   # Root component
├── routes.tsx                # React Router configuration
└── main.tsx                  # Entry point
```

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Redirects to `/triage` | — |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/triage` | TriagePage (symptom interview) | Auth required |
| `/triage/:id/result` | TriageResultPage | Auth required (owner) |
| `/submissions` | MySubmissionsPage | Auth required |
| `/admin` | DashboardPage | Admin required |
| `/admin/submissions/:id` | SubmissionDetailPage | Admin required |
| `/admin/users` | UsersPage | Admin required |

## Test Suite

**81 Vitest tests** covering components, hooks, and API types:

| Test File | What It Tests |
|-----------|---------------|
| `test/triage/TriagePage.test.tsx` | Symptom submission form, interview UI |
| `test/triage/TriageResultPage.test.tsx` | Result display, conversation history |
| `test/triage/OutcomeCard.test.tsx` | Outcome display with urgency badges |
| `test/triage/useTriageInterview.test.ts` | Interview state management hook |
| `test/admin/DashboardPage.test.tsx` | Admin dashboard layout & stats |
| `test/admin/StatsGrid.test.tsx` | Statistics cards rendering |
| `test/admin/SubmissionsTable.test.tsx` | Submissions list table |
| `test/admin/SubmissionDetailPage.test.tsx` | Submission detail view |
| `test/admin/UsersTable.test.tsx` | User management table |
| `test/admin/ImpersonateButton.test.tsx` | Admin impersonation UI |
| `api/__tests__/types.test.ts` | TypeScript type definitions |

**Playwright E2E** (requires Docker backend):
```bash
# Ensure backend is running (cd ../backend && docker compose up -d)
npx playwright test
```

Tests cover: health check, frontend load, register, and login flow.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| React 19 | UI framework |
| react-router-dom 7 | Client-side routing with lazy loading |
| @tanstack/react-query 5 | Server state management, polling, caching |
| Axios 1.16 | HTTP client with JWT interceptor |
| Tailwind CSS 4 | Utility-first CSS via `@tailwindcss/vite` |
| Vitest 4 | Unit test runner (jsdom environment) |
| @testing-library/react 16 | Component testing utilities |
| Playwright 1.60 | E2E browser testing |
| TypeScript 6 | Type safety with strict mode |
| ESLint 10 | Linting with typescript-eslint |

### Key UI Patterns

- **JWT interceptor** — Axios interceptor attaches `Authorization: Bearer` header from localStorage
- **TanStack Query** — Polling for submission status during AI processing
- **Lazy loading** — Auth and admin pages loaded via `React.lazy()` for code splitting
- **Tailwind v4** — Uses the new `@tailwindcss/vite` plugin (zero-config CSS)

## Related Repositories

- [triageflow-docs](https://github.com/psswid/triageflow-docs) — Documentation hub, ADRs, domain language
- [triageflow-backend](https://github.com/psswid/triageflow-backend) — Symfony 7.4 API
