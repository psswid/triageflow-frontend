import { clsx } from 'clsx';
import { Card } from '../../../components/ui/Card';
import { UrgencyBadge } from './UrgencyBadge';

interface OutcomeCardProps {
  readonly specialist: string;
  readonly urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  readonly justification: string;
}

const urgencyBorderClasses: Record<OutcomeCardProps['urgency'], string> = {
  LOW: 'border-l-green-500 dark:border-l-green-400',
  MEDIUM: 'border-l-yellow-500 dark:border-l-yellow-400',
  HIGH: 'border-l-orange-500 dark:border-l-orange-400',
  EMERGENCY: 'border-l-red-500 dark:border-l-red-400',
};

export function OutcomeCard({ specialist, urgency, justification }: OutcomeCardProps) {
  return (
    <Card className={clsx('border-l-4', urgencyBorderClasses[urgency])}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recommended: {specialist}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{justification}</p>
        </div>
        <UrgencyBadge urgency={urgency} />
      </div>
    </Card>
  );
}
