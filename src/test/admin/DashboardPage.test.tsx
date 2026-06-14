import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../i18n';
import { ToastProvider } from '../../components/ui/ToastProvider';

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

const mockUseAdminStats = vi.fn();
const mockUseAdminSubmissions = vi.fn();

vi.mock('../../features/admin/hooks/useAdminStats', () => ({
  useAdminStats: () => mockUseAdminStats() as Record<string, unknown>,
}));

vi.mock('../../features/admin/hooks/useAdminSubmissions', () => ({
  useAdminSubmissions: () => mockUseAdminSubmissions() as Record<string, unknown>,
}));

// Mock child components to simplify testing
vi.mock('../../features/admin/components/StatsGrid', () => ({
  StatsGrid: () => <div data-testid="stats-grid">StatsGrid</div>,
}));

vi.mock('../../features/admin/components/SubmissionsTable', () => ({
  SubmissionsTable: () => <div data-testid="submissions-table">SubmissionsTable</div>,
}));

vi.mock('../../features/admin/components/UsersTable', () => ({
  UsersTable: () => <div data-testid="users-table">UsersTable</div>,
}));

vi.mock('../../features/admin/components/FailedMessagesTable', () => ({
  FailedMessagesTable: () => <div data-testid="failed-messages-table">FailedMessagesTable</div>,
}));

import { DashboardPage } from '../../features/admin/pages/DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminStats.mockReturnValue({ data: undefined, isLoading: true, error: null });
    mockUseAdminSubmissions.mockReturnValue({ data: undefined, isLoading: true, error: null });
  });

  it('renders the page title', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('shows Overview tab by default', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });

    expect(screen.getByTestId('stats-grid')).toBeInTheDocument();
  });

  it('switches to Submissions tab when clicked', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByText('Submissions'));

    expect(screen.getByTestId('submissions-table')).toBeInTheDocument();
  });

  it('switches to Users tab when clicked', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByText('Users'));

    expect(screen.getByTestId('users-table')).toBeInTheDocument();
  });

  it('shows all four tabs', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Submissions')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Failed Messages')).toBeInTheDocument();
  });

  it('shows Failed Messages tab when clicked', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByText('Failed Messages'));

    expect(screen.getByTestId('failed-messages-table')).toBeInTheDocument();
  });
});
