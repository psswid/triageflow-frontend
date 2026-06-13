import { Link } from 'react-router-dom';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Badge } from '../../../components/ui/Badge';
import { ErrorFallback } from '../../../components/shared/ErrorFallback';
import { EmptyState } from '../../../components/shared/EmptyState';
import type { TriageSubmissionResource } from '../../../api/types';

interface SubmissionsListProps {
  readonly submissions: readonly TriageSubmissionResource[] | undefined;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

const STATUS_BADGE: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
  pending: 'pending',
  processing: 'processing',
  awaiting_answer: 'processing',
  completed: 'completed',
  failed: 'failed',
};

const URGENCY_BADGE: Record<string, 'low' | 'medium' | 'high' | 'emergency'> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency',
};

export function SubmissionsList({ submissions, isLoading, error }: SubmissionsListProps) {
  if (isLoading) {
    return (
      <div data-testid="submissions-loading">
        <Skeleton variant="table-row" lines={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorFallback error={error} />
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <EmptyState
        title="No submissions yet"
        description="Submit your first symptom description to start a triage analysis."
        action={
          <Link
            to="/triage"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start Triage
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Specialist</th>
            <th className="px-4 py-3 font-medium">Urgency</th>
            <th className="px-4 py-3 font-medium">Turns</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3">
                <Badge variant={STATUS_BADGE[submission.attributes.status] ?? 'pending'}>
                  {submission.attributes.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {submission.attributes.outcome?.specialist ?? '—'}
              </td>
              <td className="px-4 py-3">
                {submission.attributes.outcome?.urgency ? (
                  <Badge variant={URGENCY_BADGE[submission.attributes.outcome.urgency] ?? 'medium'}>
                    {submission.attributes.outcome.urgency}
                  </Badge>
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {submission.attributes.currentTurn}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(submission.attributes.submittedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {submission.attributes.status !== 'failed' ? (
                  <Link
                    to={`/triage/${submission.id}/result`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {submission.attributes.status === 'completed' ? 'View Result' : 'View Details'}
                  </Link>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
