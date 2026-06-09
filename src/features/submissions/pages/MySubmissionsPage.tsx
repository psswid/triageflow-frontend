import { useMySubmissions } from '../hooks/useMySubmissions';
import { SubmissionsList } from '../components/SubmissionsList';

export function MySubmissionsPage() {
  const { data: submissions, isLoading, error } = useMySubmissions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Submissions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review your past triage analyses and their results.
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <SubmissionsList
          submissions={submissions}
          isLoading={isLoading}
          error={error ?? null}
        />
      </div>
    </div>
  );
}
