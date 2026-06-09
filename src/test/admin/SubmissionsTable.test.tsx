import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { TriageSubmissionResource } from '../../api/types';

vi.mock('../../components/ui/Badge', () => ({
  Badge: ({ variant, children }: { variant: string; children: string }) => (
    <span data-testid={`badge-${variant}`}>{children}</span>
  ),
}));

import { SubmissionsTable } from '../../features/admin/components/SubmissionsTable';

const mockSubmission = (overrides: Partial<TriageSubmissionResource> = {}): TriageSubmissionResource => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  type: 'triage_submission',
  attributes: {
    status: 'completed',
    isSynthetic: false,
    outcome: {
      specialist: 'Cardiologist',
      urgency: 'HIGH',
      justification: 'Test justification.',
    },
    currentTurn: 2,
    conversationHistory: [],
    processingDuration: 45,
    submittedAt: '2026-06-01T10:00:00+00:00',
    processedAt: '2026-06-01T10:01:00+00:00',
    userEmail: 'test@example.com',
    ...overrides.attributes,
  },
  ...overrides,
});

function renderTable(submissions?: readonly TriageSubmissionResource[], isLoading = false, error: Error | null = null) {
  return render(
    <MemoryRouter>
      <SubmissionsTable submissions={submissions} isLoading={isLoading} error={error} />
    </MemoryRouter>,
  );
}

describe('SubmissionsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading', () => {
    renderTable(undefined, true);
    expect(screen.getByTestId('submissions-loading')).toBeInTheDocument();
  });

  it('shows empty state on error', () => {
    renderTable(undefined, false, new Error('fail'));
    expect(screen.getByText('Unable to load submissions')).toBeInTheDocument();
  });

  it('shows empty state when no submissions', () => {
    renderTable([], false, null);
    expect(screen.getByText('No submissions')).toBeInTheDocument();
  });

  it('renders submission rows', () => {
    const submissions = [
      mockSubmission(),
      mockSubmission({
        id: '223e4567-e89b-12d3-a456-426614174001',
        attributes: {
          status: 'pending',
          isSynthetic: true,
          outcome: null,
          currentTurn: 0,
          conversationHistory: [],
          processingDuration: null,
          submittedAt: '2026-06-01T10:00:00+00:00',
          processedAt: null,
          userEmail: 'test2@example.com',
        },
      }),
    ];

    renderTable(submissions, false, null);

    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('View')).toHaveLength(2);
  });

  it('shows urgency as badge when outcome exists', () => {
    const submissions = [mockSubmission()];
    renderTable(submissions, false, null);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('shows dash for missing urgency', () => {
    const submissions = [
      mockSubmission({
        attributes: {
          status: 'pending',
          isSynthetic: false,
          outcome: null,
          currentTurn: 0,
          conversationHistory: [],
          processingDuration: null,
          submittedAt: '2026-06-01T10:00:00+00:00',
          processedAt: null,
          userEmail: 'test@example.com',
        },
      }),
    ];

    renderTable(submissions, false, null);

    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });
});
