import { clsx } from 'clsx';

interface SkeletonProps {
  readonly className?: string;
  readonly lines?: number;
  readonly variant?: 'text' | 'card' | 'table-row' | 'stats-grid';
}

function SkeletonBlock({ className }: { readonly className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded bg-gray-200 dark:bg-gray-700',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function Skeleton({ className, lines = 1, variant = 'text' }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div
        className={clsx(
          'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
          className,
        )}
        aria-hidden="true"
      >
        <SkeletonBlock className="mb-4 h-4 w-3/4" />
        <SkeletonBlock className="mb-2 h-3 w-1/2" />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>
    );
  }

  if (variant === 'stats-grid') {
    return (
      <div className={clsx('grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4', className)} aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <SkeletonBlock className="mb-2 h-3 w-1/2" />
            <SkeletonBlock className="h-6 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    const rowCount = lines;
    return (
      <div className={clsx('space-y-3', className)} aria-hidden="true">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <SkeletonBlock className="h-4 w-1/6" />
            <SkeletonBlock className="h-4 w-1/4" />
            <SkeletonBlock className="h-4 w-1/6" />
            <SkeletonBlock className="h-4 w-1/5" />
            <SkeletonBlock className="h-8 w-16 ml-auto rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={clsx('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}
