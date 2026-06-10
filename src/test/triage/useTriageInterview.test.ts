/* eslint-disable @typescript-eslint/require-await */
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { ReactNode } from 'react';

// Mock the apiClient before importing the hook
// Use vi.hoisted to avoid TDZ: vi.mock factories are hoisted above const declarations
const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
  },
}));

import { useTriageInterview } from '../../features/triage/hooks/useTriageInterview';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useTriageInterview', () => {
  beforeEach(() => {
    // resetAllMocks clears mockResolvedValueOnce queues, not just call history
    vi.resetAllMocks();
  });

  describe('initial state', () => {
    it('starts in idle state', () => {
      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state).toBe('idle');
      expect(result.current.conversation).toHaveLength(0);
      expect(result.current.error).toBeNull();
      expect(result.current.status).toBeNull();
      expect(result.current.currentTurn).toBe(0);
      expect(result.current.submissionId).toBeNull();
    });
  });

  describe('submit flow', () => {
    it('transitions from idle → submitting → polling on successful submit', async () => {
      const submitResponse = {
        data: {
          id: 'sub-abc-123',
          type: 'triage_submission' as const,
          attributes: {
            status: 'processing' as const,
            submittedAt: '2026-01-01T00:00:00Z',
          },
        },
      };

      mockPost.mockResolvedValueOnce({ data: submitResponse });

      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state).toBe('idle');

      await act(async () => {
        result.current.submit('I have a severe headache');
      });

      await waitFor(() => {
        expect(result.current.state).toBe('polling');
      });

      expect(result.current.submissionId).toBe('sub-abc-123');
      expect(result.current.conversation).toHaveLength(1);
      expect(result.current.conversation[0]).toMatchObject({
        type: 'initial_description',
        content: 'I have a severe headache',
      });
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('shows error and returns to idle on submit failure', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.submit('I have a headache');
      });

      await waitFor(() => {
        expect(result.current.state).toBe('idle');
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.submissionId).toBeNull();
    });

    it('does not allow submit when not in idle state', async () => {
      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      // Transition to submitting
      mockPost.mockResolvedValueOnce({
        data: {
          data: {
            id: 'sub-1',
            type: 'triage_submission',
            attributes: { status: 'processing', submittedAt: '2026-01-01T00:00:00Z' },
          },
        },
      });

      await act(async () => {
        result.current.submit('First submit');
      });

      await waitFor(() => {
        expect(result.current.state).toBe('polling');
      });

      // Try to submit again — should be ignored
      const postCallCount = mockPost.mock.calls.length;
      await act(async () => {
        result.current.submit('Second submit');
      });

      // No additional POST calls
      expect(mockPost).toHaveBeenCalledTimes(postCallCount);
    });
  });

  describe('answer flow', () => {
    it('does not allow answer when state is not awaiting_answer', async () => {
      // First, submit successfully
      mockPost.mockResolvedValueOnce({
        data: {
          data: {
            id: 'sub-1',
            type: 'triage_submission',
            attributes: {
              status: 'processing',
              submittedAt: '2026-01-01T00:00:00Z',
            },
          },
        },
      });

      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.submit('I have a headache');
      });

      await waitFor(() => {
        expect(result.current.state).toBe('polling');
      });

      // Answer should be ignored since state is polling, not awaiting_answer
      mockPost.mockClear();
      const postCallCount = mockPost.mock.calls.length;

      await act(async () => {
        result.current.answer('It hurts on the left side');
      });

      expect(mockPost).toHaveBeenCalledTimes(postCallCount);
    });

    it('does not allow answer when submissionId is null', async () => {
      // State is idle — no submissionId
      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      const postCallCount = mockPost.mock.calls.length;
      await act(async () => {
        result.current.answer('Some answer');
      });

      expect(mockPost).toHaveBeenCalledTimes(postCallCount);
    });
  });

  describe('polling integration', () => {
    it('transitions to awaiting_answer when poll returns question', async () => {
      // Submit first
      mockPost.mockResolvedValueOnce({
        data: {
          data: {
            id: 'sub-1',
            type: 'triage_submission',
            attributes: {
              status: 'processing',
              submittedAt: '2026-01-01T00:00:00Z',
            },
          },
        },
      });

      // Mock status polling — first returns processing, then awaiting_answer
      // Note: responses are wrapped in { data: ... } to match axios response shape,
      // with an inner { data: ... } for the JSON:API envelope (ApiResponse<TriageStatusResource>)
      mockGet
        .mockResolvedValueOnce({
          data: {
            data: {
              id: 'sub-1',
              type: 'triage_submission',
              attributes: {
                status: 'processing',
                currentTurn: 0,
                lastAssistantMessage: null,
              },
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              id: 'sub-1',
              type: 'triage_submission',
              attributes: {
                status: 'awaiting_answer',
                currentTurn: 1,
                lastAssistantMessage: 'Where is the pain located?',
              },
            },
          },
        });

      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.submit('I have a headache');
      });

      // Wait for state to become polling (after submit)
      await waitFor(() => {
        expect(result.current.state).toBe('polling');
      });

      // Wait for polling to pick up the awaiting_answer status
      // timeout > refetchInterval (2000ms) since first poll returns 'processing'
      await waitFor(() => {
        expect(result.current.state).toBe('awaiting_answer');
      }, { timeout: 3000 });

      expect(result.current.conversation).toHaveLength(2);
      expect(result.current.conversation[1]).toMatchObject({
        type: 'question',
        content: 'Where is the pain located?',
      });
      expect(result.current.lastQuestion).toBe('Where is the pain located?');
    });

    it('transitions to failed on failed status', async () => {
      // Submit first
      mockPost.mockResolvedValueOnce({
        data: {
          data: {
            id: 'sub-2',
            type: 'triage_submission',
            attributes: {
              status: 'processing',
              submittedAt: '2026-01-01T00:00:00Z',
            },
          },
        },
      });

      // Mock status polling returns failed
      // Response wrapped in { data: ... } for axios, inner { data: ... } for JSON:API envelope
      mockGet.mockResolvedValueOnce({
        data: {
          data: {
            id: 'sub-2',
            type: 'triage_submission',
            attributes: {
              status: 'failed',
              currentTurn: 0,
              lastAssistantMessage: null,
            },
          },
        },
      });

      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.submit('I have a headache');
      });

      await waitFor(() => {
        expect(result.current.state).toBe('failed');
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('reset', () => {
    it('resets to initial idle state', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          data: {
            id: 'sub-1',
            type: 'triage_submission',
            attributes: {
              status: 'processing',
              submittedAt: '2026-01-01T00:00:00Z',
            },
          },
        },
      });

      const { result } = renderHook(() => useTriageInterview(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.submit('I have a headache');
      });

      await waitFor(() => {
        expect(result.current.state).not.toBe('idle');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toBe('idle');
      expect(result.current.submissionId).toBeNull();
      expect(result.current.conversation).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });
  });
});
