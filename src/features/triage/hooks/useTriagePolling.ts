import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { ApiResponse, TriageStatusResource } from '../../../api/types';

type TriageStatus = TriageStatusResource['attributes']['status'];

interface UseTriagePollingOptions {
  readonly submissionId: string | null;
  readonly interval?: number;
}

interface UseTriagePollingResult {
  readonly status: TriageStatus | null;
  readonly currentTurn: number;
  readonly lastAssistantMessage: string | null;
  readonly isPolling: boolean;
}

const POLLING_STATUSES: readonly TriageStatus[] = ['pending', 'processing', 'awaiting_answer'];

export function useTriagePolling({
  submissionId,
  interval = 2000,
}: UseTriagePollingOptions): UseTriagePollingResult {
  const { data, isFetching } = useQuery({
    queryKey: ['triage', 'status', submissionId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<TriageStatusResource>>(ENDPOINTS.TRIAGE.STATUS(submissionId!))
        .then((r) => r.data.data),
    enabled: submissionId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.attributes.status;
      // Keep polling while status is pending, processing, or awaiting_answer
      if (status && POLLING_STATUSES.includes(status)) {
        return interval;
      }
      // Stop polling when completed, failed, or no data yet
      return false;
    },
  });

  const status = data?.attributes.status ?? null;

  return {
    status,
    currentTurn: data?.attributes.currentTurn ?? 0,
    lastAssistantMessage: data?.attributes.lastAssistantMessage ?? null,
    isPolling: isFetching && status !== null && POLLING_STATUSES.includes(status),
  };
}
