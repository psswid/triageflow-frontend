import { useTranslation } from 'react-i18next';

export function UsersPage() {
  const { t } = useTranslation('admin');
  return <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.users.title')}</h1>;
}
