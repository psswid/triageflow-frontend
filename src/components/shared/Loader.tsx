import { useTranslation } from 'react-i18next';
import { Spinner } from '../ui/Spinner';

interface LoaderProps {
  readonly message?: string;
}

export function Loader({ message }: LoaderProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <Spinner size="lg" />
      <p className="mt-3 text-sm">{message ?? t('loading')}</p>
    </div>
  );
}
