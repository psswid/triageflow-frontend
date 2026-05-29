import { clsx } from 'clsx';

interface BadgeProps {
  readonly variant: 'pending' | 'processing' | 'completed' | 'failed' | 'low' | 'medium' | 'high' | 'emergency';
  readonly children: string;
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  emergency: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantClasses[variant])}>
      {children}
    </span>
  );
}
