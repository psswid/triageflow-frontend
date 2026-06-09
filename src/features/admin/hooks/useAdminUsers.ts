import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { UserResource } from '../../../api/types';

interface UsersResponse {
  readonly data: readonly UserResource[];
}

export function useAdminUsers() {
  return useQuery<readonly UserResource[]>({
    queryKey: ['admin', 'users'],
    queryFn: () =>
      apiClient.get<UsersResponse>(ENDPOINTS.ADMIN.USERS).then((r) => r.data.data),
    refetchInterval: 30_000,
  });
}
