import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { DarkModeToggle } from '../shared/DarkModeToggle';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'text-sm pb-1 border-b-2 transition-colors',
    isActive
      ? 'border-primary-500 text-gray-900 dark:text-gray-100'
      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
  );

export function MarketingHeader() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              {t('common:appName')}
            </Link>

            {/* Desktop nav with active state indicators */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <NavLink to="/about" className={navLinkClass}>
                {t('common:nav.about')}
              </NavLink>
              <NavLink to="/how-it-works" className={navLinkClass}>
                {t('common:nav.howItWorks')}
              </NavLink>
            </nav>
          </div>

          {/* Right side: tools + CTAs (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <DarkModeToggle />
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t('common:nav.login')}
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-accent-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 transition-colors"
            >
              {t('common:nav.register')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-in drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 p-6 pt-20">
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {t('common:nav.about')}
              </NavLink>
              <NavLink to="/how-it-works" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {t('common:nav.howItWorks')}
              </NavLink>
              <hr className="border-gray-200 dark:border-gray-800" />
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" onClick={() => setMenuOpen(false)}>
                {t('common:nav.login')}
              </Link>
              <Link to="/register" className="rounded-lg bg-accent-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-600 text-center" onClick={() => setMenuOpen(false)}>
                {t('common:nav.register')}
              </Link>
              <hr className="border-gray-200 dark:border-gray-800" />
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <DarkModeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
