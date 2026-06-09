import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { DashboardStats } from '../../../api/types';

interface StatsResponse {
  readonly data: DashboardStats;
}

export function useAdminStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () =>
      apiClient.get<StatsResponse>(ENDPOINTS.ADMIN.STATS).then((r) => r.data.data),
    refetchInterval: 30_000,
  });
}
