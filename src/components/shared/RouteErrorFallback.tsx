import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

function errorMessage(error: unknown, t: (key: string, fallback?: string) => string): string {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return t('notFound.message');
    if (error.status === 403) return t('error.accessDenied', 'You do not have permission to access this page.');
    if (error.status === 401) return t('error.unauthorized', 'Please log in to access this page.');
    return error.statusText || t('error.unexpected', 'An unexpected error occurred.');
  }

  if (error instanceof Error) return error.message;
  return t('error.unexpected', 'An unexpected error occurred.');
}

function errorTitle(error: unknown, t: (key: string, fallback?: string) => string): string {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return t('notFound.title');
    if (error.status === 403) return t('error.accessDeniedTitle', 'Access Denied');
    if (error.status === 401) return t('error.unauthorizedTitle', 'Unauthorized');
    return t('error.title');
  }

  return t('error.title');
}

export function RouteErrorFallback() {
  const { t } = useTranslation('common');
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <svg
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {errorTitle(error, t)}
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        {errorMessage(error, t)}
      </p>
      {!isRouteErrorResponse(error) && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 font-mono">
          {error instanceof Error ? error.name : 'Error'}
        </p>
      )}
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => window.location.reload()}
        >
          {t('error.retry')}
        </Button>
        <Link
          to="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {t('error.goHome')}
        </Link>
      </div>
    </div>
  );
}
