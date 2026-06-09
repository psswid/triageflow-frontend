import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

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

import { DashboardPage } from '../../features/admin/pages/DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminStats.mockReturnValue({ data: undefined, isLoading: true, error: null });
    mockUseAdminSubmissions.mockReturnValue({ data: undefined, isLoading: true, error: null });
  });

  it('renders the page title', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('shows Overview tab by default', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('stats-grid')).toBeInTheDocument();
  });

  it('switches to Submissions tab when clicked', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Submissions'));

    expect(screen.getByTestId('submissions-table')).toBeInTheDocument();
  });

  it('switches to Users tab when clicked', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Users'));

    expect(screen.getByText('User management will be available in a future update.')).toBeInTheDocument();
  });

  it('shows all three tabs', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Submissions')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });
});
