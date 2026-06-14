import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatsGrid } from '../components/StatsGrid';
import { SubmissionsTable } from '../components/SubmissionsTable';
import { UsersTable } from '../components/UsersTable';
import { FailedMessagesTable } from '../components/FailedMessagesTable';
import { useAdminSubmissions } from '../hooks/useAdminSubmissions';
import { useGenerateSyntheticCase } from '../hooks/useGenerateSyntheticCase';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../components/ui/ToastProvider';
import { ErrorFallback } from '../../../components/shared/ErrorFallback';

type Tab = 'overview' | 'submissions' | 'users' | 'failed-messages';

export function DashboardPage() {
  const { t } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showGeneratedMessage, setShowGeneratedMessage] = useState(false);
  const { toast } = useToast();
  const submissionsQuery = useAdminSubmissions();
  const generateMutation = useGenerateSyntheticCase(
    () => {
      setShowGeneratedMessage(true);
      setTimeout(() => setShowGeneratedMessage(false), 4000);
    },
    (err) => toast.error(`Failed to generate synthetic case: ${err.message}`),
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: t('dashboard.tabs.overview') },
    { key: 'submissions', label: t('dashboard.tabs.submissions') },
    { key: 'users', label: t('dashboard.tabs.users') },
    { key: 'failed-messages', label: t('dashboard.tabs.failedMessages') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h1>
        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generateMutation.isPending ? (
            <>
              <Spinner />
              {t('dashboard.generateSynthetic.generating')}
            </>
          ) : (
            t('dashboard.generateSynthetic.button')
          )}
        </button>
      </div>

      {/* Success message */}
      {showGeneratedMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {t('dashboard.generateSynthetic.success')}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <StatsGrid />}

      {activeTab === 'submissions' && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('dashboard.submissions.title')}
          </h2>
          {submissionsQuery.isError ? (
            <ErrorFallback
              error={submissionsQuery.error}
              onRetry={() => void submissionsQuery.refetch()}
              title={t('dashboard.submissions.empty')}
            />
          ) : (
            <SubmissionsTable
              submissions={submissionsQuery.data}
              isLoading={submissionsQuery.isLoading}
              error={submissionsQuery.error}
            />
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('dashboard.users.title')}
          </h2>
          <UsersTable />
        </div>
      )}

      {activeTab === 'failed-messages' && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('dashboard.failedMessages.title')}
          </h2>
          <FailedMessagesTable />
        </div>
      )}
    </div>
  );
}
