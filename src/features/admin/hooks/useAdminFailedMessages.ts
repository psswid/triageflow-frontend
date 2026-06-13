import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type {
  FailedMessageResource,
  FailedMessagesListResponse,
  RetryFailedMessageResponse,
  DeleteFailedMessageResponse,
} from '../../../api/types';

export function useAdminFailedMessages() {
  return useQuery<readonly FailedMessageResource[]>({
    queryKey: ['admin', 'failed-messages'],
    queryFn: () =>
      apiClient
        .get<FailedMessagesListResponse>(ENDPOINTS.ADMIN.FAILED_MESSAGES)
        .then((r) => r.data.data),
    refetchInterval: 15_000,
  });
}

export function useRetryFailedMessage(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient
        .post<RetryFailedMessageResponse>(ENDPOINTS.ADMIN.FAILED_MESSAGE_RETRY(id))
        .then((r) => r.data.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'failed-messages'] });
      onSuccess?.();
    },
  });
}

export function useDeleteFailedMessage(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient
        .delete<DeleteFailedMessageResponse>(ENDPOINTS.ADMIN.FAILED_MESSAGE_DELETE(id))
        .then((r) => r.data.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'failed-messages'] });
      onSuccess?.();
    },
  });
}
