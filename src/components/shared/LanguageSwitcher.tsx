import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] ?? 'en';

  const switchLanguage = (lang: string) => {
    void i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5" role="group" aria-label="Language selector">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLanguage(code)}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
            currentLang === code
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          aria-pressed={currentLang === code}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
