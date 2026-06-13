import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { ApiResponse, SyntheticCaseResource } from '../../../api/types';

export function useGenerateSyntheticCase(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.post<ApiResponse<SyntheticCaseResource>>(ENDPOINTS.ADMIN.SYNTHETIC_GENERATE)
        .then((r) => r.data.data),
    onSuccess: () => {
      // Invalidate stats and submissions to reflect new data
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'submissions'] });
      onSuccess?.();
    },
  });
}
