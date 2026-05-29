import { Spinner } from '../ui/Spinner';

interface LoaderProps {
  readonly message?: string;
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <Spinner size="lg" />
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}
