import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookieConsent'));

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-200 border-t border-gray-700 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm leading-relaxed flex-1">
            {t('cookieBanner.message')}
          </p>
          <button
            onClick={handleAccept}
            className="shrink-0 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 transition-colors"
          >
            {t('cookieBanner.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
