import { clsx } from 'clsx';

interface UrgencyBadgeProps {
  readonly urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
}

const urgencyClasses: Record<UrgencyBadgeProps['urgency'], string> = {
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  EMERGENCY: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const urgencyLabel: Record<UrgencyBadgeProps['urgency'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  EMERGENCY: 'Emergency',
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        urgencyClasses[urgency],
      )}
    >
      {urgencyLabel[urgency]}
    </span>
  );
}
