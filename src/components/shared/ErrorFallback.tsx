import { useState } from 'react';
import { Button } from '../ui/Button';

interface ErrorFallbackProps {
  readonly error: Error;
  readonly onRetry?: () => void;
  readonly title?: string;
}

export function ErrorFallback({ error, onRetry, title }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <svg
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title ?? 'Something went wrong'}
      </h2>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        {error.message}
      </p>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 underline"
      >
        {showDetails ? 'Hide' : 'Show'} error details
      </button>
      {showDetails && (
        <pre className="mt-2 max-w-md overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {error.stack ?? error.message}
        </pre>
      )}

      {onRetry && (
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={onRetry}>Retry</Button>
        </div>
      )}
    </div>
  );
}
