import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../i18n';
import { TriageResultPage } from '../../features/triage/pages/TriageResultPage';
import type { ConversationMessage, TriageSubmissionResource, ApiResponse } from '../../api/types';

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

function renderTriageResultPage(initialRoute = '/triage/test-123/result') {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/triage/:id/result" element={<TriageResultPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function buildSuccessResponse(
  overrides: Partial<TriageSubmissionResource['attributes']> = {},
): { data: ApiResponse<TriageSubmissionResource> } {
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
        type: 'triage_submission',
        attributes: {
          status: 'completed',
          isSynthetic: false,
          outcome: {
            specialist: 'Neurologist',
            urgency: 'HIGH',
            justification: 'Severe headache with photophobia requires neurological evaluation',
          },
          currentTurn: 2,
          conversationHistory: history,
          processingDuration: 15.5,
          submittedAt: '2026-05-30T00:00:00Z',
          processedAt: '2026-05-30T00:00:15Z',
          ...overrides,
        },
      },
    },
  };
}

describe('TriageResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Loading state ---
  it('shows skeleton while fetching the result', () => {
    mockGet.mockReturnValue(new Promise<never>(() => undefined)); // never resolves

    renderTriageResultPage();

    // Skeleton renders aria-hidden elements with animate-pulse
    const skeletonEl = document.querySelector('.animate-pulse');
    expect(skeletonEl).toBeInTheDocument();
  });

  // --- Success state with outcome ---
  it('renders outcome with specialist, urgency badge, and justification', async () => {
    mockGet.mockResolvedValue(buildSuccessResponse());

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Recommended: Neurologist')).toBeInTheDocument();
    });

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(
      screen.getByText('Severe headache with photophobia requires neurological evaluation'),
    ).toBeInTheDocument();
  });

  // --- Success state with conversation history ---
  it('renders conversation history with user and AI messages', async () => {
    mockGet.mockResolvedValue(buildSuccessResponse());

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Conversation History')).toBeInTheDocument();
    });

    // User messages should appear
    expect(screen.getByText('I have a severe headache')).toBeInTheDocument();
    expect(screen.getByText('Yes, very much so')).toBeInTheDocument();

    // AI messages should appear
    expect(screen.getByText('Does light bother your eyes?')).toBeInTheDocument();
  });

  // --- 404 error state ---
  it('shows "Result Not Found" for a 404 error', async () => {
    mockGet.mockRejectedValue({
      response: { status: 404 },
    });

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Result Not Found')).toBeInTheDocument();
    });
  });

  // --- 403 error state ---
  it('shows "Access Denied" for a 403 error', async () => {
    mockGet.mockRejectedValue({
      response: { status: 403 },
    });

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  // --- Null outcome state ---
  it('shows "Analysis in Progress" when outcome is null', async () => {
    mockGet.mockResolvedValue(
      buildSuccessResponse({
        status: 'processing',
        outcome: null,
      }),
    );

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Triage not yet completed')).toBeInTheDocument();
    });
  });

  // --- Null outcome still shows conversation ---
  it('shows conversation history even when outcome is null', async () => {
    mockGet.mockResolvedValue(
      buildSuccessResponse({
        status: 'processing',
        outcome: null,
      }),
    );

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Conversation History')).toBeInTheDocument();
    });

    expect(screen.getByText('I have a severe headache')).toBeInTheDocument();
  });

  // --- New Triage button ---
  it('renders a "New Triage" button when outcome is present', async () => {
    mockGet.mockResolvedValue(buildSuccessResponse());

    renderTriageResultPage();

    await waitFor(() => {
      expect(screen.getByText('Start New Triage')).toBeInTheDocument();
    });
  });

  // --- Generic error state ---
  it('shows ErrorFallback for unknown errors', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    renderTriageResultPage();

    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Network Error')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
