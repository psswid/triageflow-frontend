import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUseAdminStats = vi.fn();

vi.mock('../../features/admin/hooks/useAdminStats', () => ({
  useAdminStats: () => mockUseAdminStats() as Record<string, unknown>,
}));

import { StatsGrid } from '../../features/admin/components/StatsGrid';

describe('StatsGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading', () => {
    mockUseAdminStats.mockReturnValue({ data: undefined, isLoading: true, error: null });

    render(<StatsGrid />);

    expect(screen.getByTestId('stats-loading')).toBeInTheDocument();
  });

  it('shows ErrorFallback on error', () => {
    mockUseAdminStats.mockReturnValue({ data: undefined, isLoading: false, error: new Error('fail') });

    render(<StatsGrid />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('fail')).toBeInTheDocument();
  });

  it('shows ErrorFallback when no data', () => {
    mockUseAdminStats.mockReturnValue({ data: undefined, isLoading: false, error: null });

    render(<StatsGrid />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('No data returned')).toBeInTheDocument();
  });

  it('renders stat cards with values', () => {
    mockUseAdminStats.mockReturnValue({
      data: {
        total: 42,
        synthetic: 10,
        pending: 5,
        processing: 3,
        completed: 30,
        failed: 4,
        avgProcessingDuration: 120,
        bySpecialist: [{ specialist: 'Cardiologist', count: 15 }],
        byUrgency: [{ urgency: 'HIGH', count: 8 }],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsGrid />);

    expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Synthetic')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Avg Duration')).toBeInTheDocument();
    expect(screen.getByText('2m 0s')).toBeInTheDocument();
  });

  it('renders specialist breakdown', () => {
    mockUseAdminStats.mockReturnValue({
      data: {
        total: 10,
        synthetic: 2,
        pending: 1,
        processing: 1,
        completed: 7,
        failed: 1,
        avgProcessingDuration: null,
        bySpecialist: [
          { specialist: 'Cardiologist', count: 5 },
          { specialist: 'Neurologist', count: 3 },
        ],
        byUrgency: [],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsGrid />);

    expect(screen.getByText('By Specialist')).toBeInTheDocument();
    expect(screen.getByText('Cardiologist')).toBeInTheDocument();
    expect(screen.getByText('Neurologist')).toBeInTheDocument();
  });

  it('renders urgency breakdown', () => {
    mockUseAdminStats.mockReturnValue({
      data: {
        total: 10,
        synthetic: 2,
        pending: 1,
        processing: 1,
        completed: 7,
        failed: 1,
        avgProcessingDuration: null,
        bySpecialist: [],
        byUrgency: [
          { urgency: 'HIGH', count: 4 },
          { urgency: 'LOW', count: 6 },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsGrid />);

    expect(screen.getByText('By Urgency')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('formats seconds correctly', () => {
    mockUseAdminStats.mockReturnValue({
      data: {
        total: 1,
        synthetic: 0,
        pending: 0,
        processing: 0,
        completed: 1,
        failed: 0,
        avgProcessingDuration: 45,
        bySpecialist: [],
        byUrgency: [],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsGrid />);

    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  it('shows N/A when no avg processing duration', () => {
    mockUseAdminStats.mockReturnValue({
      data: {
        total: 0,
        synthetic: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        avgProcessingDuration: null,
        bySpecialist: [],
        byUrgency: [],
      },
      isLoading: false,
      error: null,
    });

    render(<StatsGrid />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
