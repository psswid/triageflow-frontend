import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BrainCircuit, Layers, RefreshCw, BarChart4, ArrowRight, FlaskConical } from 'lucide-react';
import { DemoPreview } from '../components/DemoPreview';

const features = [
  { key: 'aiTriage', icon: BrainCircuit },
  { key: 'fullStack', icon: Layers },
  { key: 'synthetic', icon: RefreshCw },
  { key: 'observability', icon: BarChart4 },
] as const;

const techCategories = [
  {
    label: 'Backend',
    stacks: ['Symfony 7.4', 'PHP 8.4', 'PostgreSQL 16', 'Docker', 'Nginx'],
  },
  {
    label: 'Frontend',
    stacks: ['React 19', 'TypeScript 6', 'Tailwind CSS 4', 'Vite 8'],
  },
  {
    label: 'AI / ML',
    stacks: ['OpenRouter', 'LLaMA 4', 'Gemma 4', 'Synthetic Cases'],
  },
  {
    label: 'Infrastructure',
    stacks: ['GitHub Actions', 'PHPStan', 'Vitest', 'Playwright'],
  },
];

export default function LandingPage() {
  const { t } = useTranslation('landing');
  const { t: tc } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('hero.title')} — TriageFlow</title>
        <meta name="description" content={tc('tagline')} />
      </Helmet>

      {/* Hero Section — Glassmorphism */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 dark:from-primary-950 dark:via-primary-900 dark:to-accent-950">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative flex justify-center items-center min-h-[80vh] py-20 px-4">
          <div className="max-w-3xl w-full p-10 sm:p-14 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-primary-950/30 dark:bg-white/5 dark:border-white/10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white leading-tight">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <p className="text-sm text-primary-200 dark:text-primary-300/80 mt-4">
              {t('hero.disclaimer')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-600 text-white px-8 py-4 text-lg font-semibold hover:bg-accent-700 transition-colors shadow-lg shadow-accent-600/30"
              >
                {t('hero.cta')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 text-white px-8 py-4 text-lg font-medium hover:bg-white/10 transition-colors"
              >
                {t('hero.secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center font-heading mb-12">
            {t('features.title')}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6
                           hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mb-4
                                group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-gray-900 dark:text-gray-100">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
                  {t(`features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-400 dark:text-gray-400 max-w-2xl mx-auto">
            <FlaskConical className="w-4 h-4 inline-block mr-1" />
            {t('features.disclaimer')}
          </p>
        </div>
      </section>

      {/* Demo Preview Section */}
      <DemoPreview />

      {/* Tech Stack Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-center text-gray-900 dark:text-gray-100">
            {t('techStack.title')}
          </h2>

          <div className="mt-12 space-y-8">
            {techCategories.map(({ label, stacks }) => (
              <div key={label}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {stacks.map((stack) => (
                    <span
                      key={stack}
                      className="inline-flex items-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-400 dark:text-gray-400 flex items-center justify-center gap-2">
            <FlaskConical className="w-4 h-4" />
            {t('techStack.disclaimer')}
          </p>
        </div>
      </section>

      {/* Demo Mode Banner */}
      <div className="bg-amber-50 dark:bg-amber-950 border-t border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <FlaskConical className="w-4 h-4 inline-block mr-1" />
            {t('demoMode')}
          </p>
        </div>
      </div>
    </>
  );
}
