import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface HeaderProps {
  readonly isAuthenticated: boolean;
  readonly isAdmin: boolean;
  readonly onLogout: () => void;
}

export function Header({ isAuthenticated, isAdmin, onLogout }: HeaderProps) {
  const { t } = useTranslation('common');

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {t('appName')}
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/triage" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                {t('nav.newTriage')}
              </Link>
              <Link to="/submissions" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                {t('nav.mySubmissions')}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  {t('nav.admin')}
                </Link>
              )}
              <Button variant="secondary" size="sm" onClick={onLogout}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
