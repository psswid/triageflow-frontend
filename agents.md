# TriageFlow Frontend — Agent Configuration

> React 19 + Vite + TypeScript frontend rules for AI agents. Load this file before ANY frontend work (components, pages, API client, testing). Patient triage interview UI + Admin dashboard.

## Quick Reference

```bash
# Create React + Vite + TypeScript project
npm create vite@latest frontend -- --template react-ts

# Install dependencies
npm install react-router-dom @tanstack/react-query
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react

# Development
npm run dev            # Start dev server on port 5173

# Testing
npm run test           # Run Vitest tests
npm run test:watch     # Watch mode

# Type checking
npm run typecheck      # tsc --noEmit

# Build
npm run build          # Production build to dist/
```

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.x | UI framework |
| Vite | 6.x | Build tool + dev server |
| TypeScript | 5.x | Type safety (strict mode) |
| React Router | 7.x | Client-side routing |
| TanStack Query | 5.x | Server state + API caching |
| Tailwind CSS | 4.x | Utility-first styling |
| Vitest | 3.x | Unit/integration testing |
| Testing Library | latest | Component testing |

## Directory Structure

```
src/
├── api/
│   ├── client.ts              # Axios/fetch wrapper with JWT
│   ├── endpoints.ts            # API endpoint definitions
│   ├── types.ts                # API response types (generated from OpenAPI)
│   └── hooks.ts                # TanStack Query hooks
├── components/
│   ├── ui/                     # Reusable UI primitives (Button, Card, Input)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/                 # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── shared/                 # Shared composite components
│       ├── Loader.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
├── features/
│   ├── triage/                 # Patient triage interview
│   │   ├── pages/
│   │   │   ├── TriagePage.tsx
│   │   │   └── TriageResultPage.tsx
│   │   ├── components/
│   │   │   ├── SymptomForm.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ResultCard.tsx
│   │   └── hooks/
│   │       └── useTriage.ts
│   ├── admin/                  # Admin dashboard
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── SubmissionDetailPage.tsx
│   │   └── components/
│   │       ├── StatsGrid.tsx
│   │       └── SubmissionsTable.tsx
│   └── synthetic/              # Synthetic data status
│       └── components/
│           └── LiveFeed.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useTheme.ts
├── lib/
│   ├── utils.ts                # General utilities
│   └── constants.ts            # App constants
├── styles/
│   ├── index.css               # Tailwind imports + globals
│   └── design-system.css       # Custom design tokens
├── App.tsx
├── main.tsx
└── routes.tsx
```

## Component Conventions

### Component Pattern

```tsx
// ✅ CORRECT: Well-typed functional component
interface SymptomFormProps {
  readonly symptoms: readonly string[];
  readonly onNext: (symptoms: readonly string[]) => void;
  readonly isLoading: boolean;
}

export function SymptomForm({ symptoms, onNext, isLoading }: SymptomFormProps) {
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleToggle = useCallback((symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  }, []);

  return (
    <div className="space-y-4">
      {symptoms.map((symptom) => (
        <button
          key={symptom}
          onClick={() => handleToggle(symptom)}
          className={clsx(
            'rounded-lg border p-4 transition-colors',
            selected.includes(symptom)
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700',
          )}
        >
          {symptom}
        </button>
      ))}
      <Button onClick={() => onNext(selected)} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Next'}
      </Button>
    </div>
  );
}

// ❌ BAD: No types, inline styles, no loading state
export function SymptomForm({ symptoms, onNext }) {
  return <div>{symptoms.map(s => <div onClick={() => onNext([s])}>{s}</div>)}</div>;
}
```

### Rules
- **All components must be functions** — no class components
- **Named exports only** — no default exports for components
- **Props interface co-located** with component
- **`readonly` on all props** — props are never mutated
- **`useCallback` / `useMemo`** for derived values and handlers passed to children
- **Never use `any`** — use `unknown` and type narrowing
- **Error boundaries** at feature level (not per component)
- **Loading states** for every async operation
- **Empty states** for every list component
- **Dark mode** via Tailwind `dark:` variants + system preference detection

## State Management

### Server State → TanStack Query

```tsx
// api/hooks.ts
export function useTriageResult(id: string) {
  return useQuery({
    queryKey: ['triage', id],
    queryFn: () => apiClient.get<TriageResult>(`/api/triage/result/${id}`),
    refetchInterval: (query) => {
      // Poll every 2s while processing
      return query.state.data?.status === 'processing' ? 2000 : false;
    },
  });
}

export function useSubmitTriage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TriageSubmission) =>
      apiClient.post('/api/triage/submit', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}
```

### Client State → useState / useReducer

Only for UI-only state (form values, toggles, modals). Everything from the API goes through TanStack Query.

## API Client

```tsx
// api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

### API Rules
- **Single `apiClient` instance** — no scattered fetch calls
- **All API types in `api/types.ts`** — generated from OpenAPI spec when possible
- **TanStack Query for all GET requests** — caching, refetching, polling
- **TanStack Query mutations for POST/PUT/PATCH** — optimistic updates where safe
- **Error handling in interceptor** — not in every component
- **Polling for async endpoints** — triage results use `refetchInterval`

## Routing

```tsx
// routes.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'triage', element: <TriagePage /> },
      { path: 'triage/:id/result', element: <TriageResultPage /> },
      {
        path: 'admin',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'submissions/:id', element: <SubmissionDetailPage /> },
        ],
      },
    ],
  },
]);
```

## Styling with Tailwind CSS

### Design Tokens (Tailwind Config)

```ts
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a5f',
        },
        urgency: {
          low: '#22c55e',
          medium: '#eab308',
          high: '#f97316',
          emergency: '#ef4444',
        },
      },
    },
  },
};
```

### Rules
- **Tailwind utilities first** — avoid inline styles and CSS modules
- **`clsx` for conditional classes** — never string concatenation
- **Mobile-first** — use `sm:`, `md:`, `lg:` breakpoints
- **Dark mode** — always include `dark:` variants
- **Custom classes** in `design-system.css` for repeated patterns (card, badge, etc.)
- **Accessibility** — WCAG AA minimum (color contrast, focus states, aria labels)

## Testing with Vitest

```tsx
// SymptomForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SymptomForm } from './SymptomForm';

describe('SymptomForm', () => {
  const mockSymptoms = ['Chest pain', 'Headache', 'Dizziness'];
  const mockOnNext = vi.fn();

  it('renders all symptoms as buttons', () => {
    render(
      <SymptomForm
        symptoms={mockSymptoms}
        onNext={mockOnNext}
        isLoading={false}
      />,
    );

    expect(screen.getByText('Chest pain')).toBeInTheDocument();
    expect(screen.getByText('Headache')).toBeInTheDocument();
    expect(screen.getByText('Dizziness')).toBeInTheDocument();
  });

  it('toggles symptom selection on click', () => {
    render(
      <SymptomForm
        symptoms={mockSymptoms}
        onNext={mockOnNext}
        isLoading={false}
      />,
    );

    const chestPain = screen.getByText('Chest pain');
    fireEvent.click(chestPain);
    expect(chestPain).toHaveClass('border-blue-500');

    fireEvent.click(chestPain);
    expect(chestPain).not.toHaveClass('border-blue-500');
  });

  it('disables next button when loading', () => {
    render(
      <SymptomForm
        symptoms={mockSymptoms}
        onNext={mockOnNext}
        isLoading={true}
      />,
    );

    expect(screen.getByText('Analyzing...')).toBeDisabled();
  });
});
```

### Testing Rules
- **Vitest + Testing Library** — no Enzyme, no Jest
- **Test behavior, not implementation** — user interactions, not state internals
- **Mock API calls** via `vi.mock()` or MSW (Mock Service Worker)
- **Test loading, error, and empty states** — not just happy path
- **Accessibility queries** — `getByRole`, `getByLabelText` over `getByTestId`

## TypeScript Conventions

```tsx
// ✅ Good: Discriminated unions for API states
type TriageState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: TriageResult }
  | { status: 'error'; error: string };

// ✅ Good: Readonly arrays and objects
interface TriageResult {
  readonly id: string;
  readonly specialist: SpecialistType;
  readonly urgency: UrgencyLevel;
  readonly justification: string;
  readonly submittedAt: string;
}

// ❌ Bad: any, mutable types
interface BadResult {
  id: any;
  specialist: string;
  urgency: string;
}
```

### Rules
- **Strict mode in `tsconfig.json`** — `strict: true`
- **Interfaces for object shapes** — `type` for unions/primitives
- **`readonly` on all props and return types**
- **Discriminated unions** for loading/error/success states
- **No `as` casts** — use type guards instead
- **`satisfies` operator** for config objects (TypeScript 5.x)

## Related Files

- `../agents.md` — Master project configuration
- `../.opencode/config.json` — OpenCode configuration
- `../.opencode/skills/triageflow/SKILL.md` — Domain conventions
- `../backend/agents.md` — Backend rules (API contracts, response shapes)

## Maintenance

Update this file when:
- New dependencies are added
- Component patterns evolve
- API types change
- New features require new page/component patterns
- Testing strategy changes
