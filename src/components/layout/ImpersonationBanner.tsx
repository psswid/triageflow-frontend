import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function ImpersonationBanner() {
  const { t } = useTranslation('admin');
  const { isImpersonating, impersonatedEmail, exitImpersonation } = useAuth();

  if (!isImpersonating || !impersonatedEmail) return null;

  return (
    <div className="bg-amber-500 px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-sm font-medium text-amber-950">
          {t('dashboard.impersonation.banner', { email: impersonatedEmail })}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            exitImpersonation();
            window.location.href = '/admin';
          }}
        >
          {t('dashboard.impersonation.backToAdmin')}
        </Button>
      </div>
    </div>
  );
}
