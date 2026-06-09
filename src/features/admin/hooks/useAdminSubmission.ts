import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { TriageSubmissionResource } from '../../../api/types';

interface SubmissionResponse {
  readonly data: TriageSubmissionResource;
}

export function useAdminSubmission(id: string | undefined) {
  return useQuery<TriageSubmissionResource>({
    queryKey: ['admin', 'submission', id],
    queryFn: () =>
      apiClient
        .get<SubmissionResponse>(ENDPOINTS.ADMIN.SUBMISSION_DETAIL(id!))
        .then((r) => r.data.data),
    enabled: id !== undefined,
  });
}
