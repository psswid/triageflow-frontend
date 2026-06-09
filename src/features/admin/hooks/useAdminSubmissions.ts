import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { TriageSubmissionResource } from '../../../api/types';

interface SubmissionsResponse {
  readonly data: readonly TriageSubmissionResource[];
}

export function useAdminSubmissions() {
  return useQuery<readonly TriageSubmissionResource[]>({
    queryKey: ['admin', 'submissions'],
    queryFn: () =>
      apiClient.get<SubmissionsResponse>(ENDPOINTS.ADMIN.SUBMISSIONS).then((r) => r.data.data),
    refetchInterval: 15_000,
  });
}
