import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';

export function useGenerateSyntheticCase(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.post(ENDPOINTS.ADMIN.SYNTHETIC_GENERATE).then((r) => r.data.data),
    onSuccess: () => {
      // Invalidate stats and submissions to reflect new data
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'submissions'] });
      onSuccess?.();
    },
  });
}
