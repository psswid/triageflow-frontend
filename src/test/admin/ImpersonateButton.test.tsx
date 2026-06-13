import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// --- Hoisted mocks (available before vi.mock factory hoisting) ---
const { mockPost, mockNavigate, mockImpersonate } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockNavigate: vi.fn(),
  mockImpersonate: vi.fn(),
}));

// --- Module-level mocks ---
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ impersonate: mockImpersonate }),
}));

vi.mock('../../api/client', () => ({
  apiClient: { post: mockPost },
}));

// --- Component under test ---
import { ImpersonateButton } from '../../features/admin/components/ImpersonateButton';

// --- Helpers ---
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderButton(userId = 'user-1', userEmail = 'test@example.com') {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ImpersonateButton userId={userId} userEmail={userEmail} />
    </QueryClientProvider>,
  );
}

// --- Tests ---
describe('ImpersonateButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with Login as text', () => {
    renderButton('user-1', 'test@example.com');

    const button = screen.getByRole('button', { name: /login as/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('triggers impersonation API call on click', async () => {
    mockPost.mockResolvedValue({
      data: { data: { token: 'test-token', impersonated: 'test@example.com' } },
    });

    renderButton('user-42', 'user@example.com');

    fireEvent.click(screen.getByRole('button', { name: /login as/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/admin/users/user-42/impersonate');
    });
  });

  it('shows loading state while mutation is pending', async () => {
    // Promise that never resolves keeps isPending = true
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockPost.mockReturnValue(new Promise<never>(() => {}));

    const { container } = renderButton();
    fireEvent.click(screen.getByRole('button', { name: /login as/i }));

    // Wait for React Query to mark mutation as pending
    await waitFor(() => {
      // Button should be disabled during loading
      expect(screen.getByRole('button')).toBeDisabled();
    });

    // Spinner is rendered with animate-spin class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('stores token and navigates to /triage on success', async () => {
    mockPost.mockResolvedValue({
      data: { data: { token: 'test-token', impersonated: 'test@example.com' } },
    });

    renderButton('user-1', 'test@example.com');
    fireEvent.click(screen.getByRole('button', { name: /login as/i }));

    await waitFor(() => {
      expect(mockImpersonate).toHaveBeenCalledWith('test-token', 'test@example.com');
      expect(mockNavigate).toHaveBeenCalledWith('/triage');
    });
  });
});
