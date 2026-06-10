import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubmissionDetailPage } from '../../features/admin/pages/SubmissionDetailPage';
import type { ConversationMessage, TriageSubmissionResource } from '../../api/types';

// Mock the API client
vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { apiClient } from '../../api/client';

// eslint-disable-next-line @typescript-eslint/unbound-method
const mockGet = apiClient.get as ReturnType<typeof vi.fn>;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderSubmissionDetailPage(initialRoute = '/admin/submissions/test-123') {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/admin/submissions/:id" element={<SubmissionDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function buildSuccessResponse(
  overrides: Partial<TriageSubmissionResource['attributes']> = {},
) {
  const history: readonly ConversationMessage[] = [
    {
      type: 'initial_description',
      content: 'I have a severe headache',
      timestamp: '2026-05-30T00:00:00Z',
    },
    {
      type: 'question',
      content: 'Does light bother your eyes?',
      timestamp: '2026-05-30T00:00:05Z',
    },
    {
      type: 'answer',
      content: 'Yes, very much so',
      timestamp: '2026-05-30T00:00:10Z',
    },
  ];

  return {
    data: {
      data: {
        id: 'test-123',
        type: 'triage_submission' as const,
        attributes: {
          status: 'completed' as const,
          isSynthetic: false,
          outcome: {
            specialist: 'Neurologist',
            urgency: 'HIGH',
            justification:
              'Severe headache with photophobia requires neurological evaluation',
          },
          currentTurn: 2,
          conversationHistory: history,
          processingDuration: 15.5,
          submittedAt: '2026-05-30T00:00:00Z',
          processedAt: '2026-05-30T00:00:15Z',
          userEmail: 'patient@example.com',
          ...overrides,
        },
      },
    },
  };
}

describe('SubmissionDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Loading state ---
  it('renders loading spinner while fetching', () => {
    mockGet.mockReturnValue(new Promise<never>(() => undefined)); // never resolves

    const { container } = renderSubmissionDetailPage();

    // Spinner renders an SVG with animate-spin class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  // --- 404 error state ---
  it('renders error EmptyState when submission not found (404)', async () => {
    mockGet.mockRejectedValue({
      response: { status: 404 },
    });

    renderSubmissionDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Submission not found')).toBeInTheDocument();
    });

    expect(
      screen.getByText('The requested submission could not be loaded.'),
    ).toBeInTheDocument();
  });

  // --- Generic error state ---
  it('renders error EmptyState when API call fails', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    renderSubmissionDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Submission not found')).toBeInTheDocument();
    });
  });

  // --- Success state with outcome and conversation ---
  it('renders full submission detail with outcome and conversation history', async () => {
    mockGet.mockResolvedValue(buildSuccessResponse());

    renderSubmissionDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Submission Detail')).toBeInTheDocument();
    });

    // Status badge
    expect(screen.getByText('completed')).toBeInTheDocument();

    // User email
    expect(screen.getByText('patient@example.com')).toBeInTheDocument();

    // Type label
    expect(screen.getByText('Real')).toBeInTheDocument();

    // Outcome section
    expect(screen.getByText('Triage Outcome')).toBeInTheDocument();
    expect(screen.getByText('Neurologist')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Severe headache with photophobia requires neurological evaluation',
      ),
    ).toBeInTheDocument();

    // Conversation history
    expect(screen.getByText('Conversation History')).toBeInTheDocument();
    expect(screen.getByText('I have a severe headache')).toBeInTheDocument();
    expect(
      screen.getByText('Does light bother your eyes?'),
    ).toBeInTheDocument();
    expect(screen.getByText('Yes, very much so')).toBeInTheDocument();
  });

  // --- Missing outcome ---
  it('handles missing outcome gracefully (no outcome section)', async () => {
    mockGet.mockResolvedValue(
      buildSuccessResponse({
        status: 'processing',
        outcome: null,
      }),
    );

    renderSubmissionDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Submission Detail')).toBeInTheDocument();
    });

    // Outcome heading should not exist
    expect(screen.queryByText('Triage Outcome')).not.toBeInTheDocument();

    // Specialist should not exist either
    expect(screen.queryByText('Neurologist')).not.toBeInTheDocument();
  });
});
