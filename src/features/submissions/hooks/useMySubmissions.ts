import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { TriageSubmissionResource } from '../../../api/types';

interface SubmissionsResponse {
  readonly data: readonly TriageSubmissionResource[];
}

export function useMySubmissions() {
  return useQuery<readonly TriageSubmissionResource[]>({
    queryKey: ['my', 'submissions'],
    queryFn: () =>
      apiClient
        .get<SubmissionsResponse>(ENDPOINTS.TRIAGE.MY_SUBMISSIONS)
        .then((r) => r.data.data),
    refetchInterval: 15_000,
  });
}
