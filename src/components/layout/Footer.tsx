import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DarkModeToggle } from '../shared/DarkModeToggle';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Col 1: Brand + copyright */}
          <div>
            <span className="font-bold text-primary-600 dark:text-primary-400">TriageFlow</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              © {year} Piotr Świderski
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              {t('common:footer.builtWith')}
            </p>
          </div>

          {/* Col 2: Legal links */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link
              to="/privacy"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {t('common:footer.privacy')}
            </Link>
            <Link
              to="/terms"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {t('common:footer.terms')}
            </Link>
            <Link
              to="/cookies"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {t('common:footer.cookies')}
            </Link>
            <Link
              to="/contact"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {t('common:footer.contact')}
            </Link>
          </div>

          {/* Col 3: Tools */}
          <div className="flex items-center gap-2 justify-start sm:justify-end lg:justify-end">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
