import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function ImpersonationBanner() {
  const { isImpersonating, impersonatedEmail, exitImpersonation } = useAuth();

  if (!isImpersonating || !impersonatedEmail) return null;

  return (
    <div className="bg-amber-500 px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-sm font-medium text-amber-950">
          🔍 Viewing as{' '}
          <span className="font-semibold">{impersonatedEmail}</span>
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            exitImpersonation();
            window.location.href = '/admin';
          }}
        >
          Back to admin
        </Button>
      </div>
    </div>
  );
}
