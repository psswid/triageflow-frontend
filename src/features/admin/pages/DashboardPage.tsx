import { useState } from 'react';
import { StatsGrid } from '../components/StatsGrid';
import { SubmissionsTable } from '../components/SubmissionsTable';
import { UsersTable } from '../components/UsersTable';
import { useAdminSubmissions } from '../hooks/useAdminSubmissions';

type Tab = 'overview' | 'submissions' | 'users';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const submissionsQuery = useAdminSubmissions();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'submissions', label: 'Submissions' },
    { key: 'users', label: 'Users' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
      </div>

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
            All Submissions
          </h2>
          <SubmissionsTable
            submissions={submissionsQuery.data}
            isLoading={submissionsQuery.isLoading}
            error={submissionsQuery.error}
          />
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Users
          </h2>
          <UsersTable />
        </div>
      )}
    </div>
  );
}
