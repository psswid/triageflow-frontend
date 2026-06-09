import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <svg
          className="h-8 w-8 text-gray-500 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
