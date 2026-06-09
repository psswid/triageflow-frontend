import { useAdminStats } from '../hooks/useAdminStats';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/shared/EmptyState';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </Card>
  );
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return 'N/A';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function StatsGrid() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8" data-testid="stats-loading">
        <Spinner />
      </div>
    );
  }

  if (error || !stats) {
    return <EmptyState title="Unable to load stats" description="Could not fetch dashboard statistics." />;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Submissions" value={stats.total} />
        <StatCard label="Synthetic" value={stats.synthetic} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Processing" value={stats.processing} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Failed" value={stats.failed} />
        <StatCard label="Avg Duration" value={formatDuration(stats.avgProcessingDuration)} />
      </div>

      {/* By Urgency */}
      {stats.byUrgency.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">By Urgency</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.byUrgency.map(({ urgency, count }) => (
              <Card key={urgency} className="p-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{urgency}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{count}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* By Specialist */}
      {stats.bySpecialist.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">By Specialist</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {stats.bySpecialist.map(({ specialist, count }) => (
              <Card key={specialist} className="p-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{specialist}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{count}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
