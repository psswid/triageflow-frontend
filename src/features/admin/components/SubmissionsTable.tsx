import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorFallback } from '../../../components/shared/ErrorFallback';
import type { TriageSubmissionResource } from '../../../api/types';

interface SubmissionsTableProps {
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

export function SubmissionsTable({ submissions, isLoading, error }: SubmissionsTableProps) {
  const { t } = useTranslation('admin');

  if (isLoading) {
    return (
      <div data-testid="submissions-loading">
        <Skeleton variant="table-row" lines={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (!submissions || submissions.length === 0) {
    return <EmptyState title={t('dashboard.submissions.empty')} description={t('dashboard.submissions.empty')} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.status')}</th>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.user')}</th>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.synthetic')}</th>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.specialist')}</th>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.urgency')}</th>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.date')}</th>
            <th className="px-4 py-3 font-medium">{t('dashboard.submissions.table.actions')}</th>
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
                <span className="text-gray-900 dark:text-gray-100">
                  {submission.attributes.userEmail ?? '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                {submission.attributes.isSynthetic ? (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">{t('dashboard.submissions.table.synthetic')}</span>
                ) : (
                  <span className="text-gray-500">Real</span>
                )}
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
                {new Date(submission.attributes.submittedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/admin/submissions/${submission.id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {t('dashboard.submissions.viewDetails')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
