import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const techDecisions = [
  { label: 'ARCHITECTURE', title: 'techDecisions.architecture', detail: 'techDecisions.architectureDetail' },
  { label: 'STATE', title: 'techDecisions.state', detail: 'techDecisions.stateDetail' },
  { label: 'AI', title: 'techDecisions.ai', detail: 'techDecisions.aiDetail' },
  { label: 'DATA', title: 'techDecisions.data', detail: 'techDecisions.dataDetail' },
  { label: 'TESTING', title: 'techDecisions.testing', detail: 'techDecisions.testingDetail' },
  { label: 'DEMO', title: 'techDecisions.demo', detail: 'techDecisions.demoDetail' },
]

export default function AboutPage() {
  const { t } = useTranslation('about')

  return (
    <>
      <Helmet>
        <title>{t('title')} — TriageFlow</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100">{t('title')}</h1>

        {/* Intro */}
        <section className="mt-8">
          <div className="max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: t('intro') }} />
        </section>

        {/* Who Built This */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold font-heading border-l-4 border-primary-500 pl-4 text-gray-900 dark:text-gray-100">
            {t('who.title')}
          </h2>

          <div className="mt-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
              PŚ
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">Piotr Świderski</p>
              <a href="https://github.com/psswid" target="_blank" rel="noopener noreferrer"
                 className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 mt-1">
                <GithubIcon className="w-4 h-4" /> {t('who.github')}
              </a>
            </div>
          </div>

          <div className="mt-6 max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: t('who.body') }} />
        </section>

        {/* Why TriageFlow */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold font-heading border-l-4 border-primary-500 pl-4 text-gray-900 dark:text-gray-100">
            {t('why.title')}
          </h2>
          <div className="mt-6 max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: t('why.body') }} />
        </section>

        {/* Tech Decisions */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold font-heading border-l-4 border-primary-500 pl-4 text-gray-900 dark:text-gray-100">
            {t('techDecisions.title')}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techDecisions.map(({ label, title, detail }) => (
              <div key={label} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <span className="text-xs font-mono text-primary-600 dark:text-primary-400">{label}</span>
                <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{t(title)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t(detail)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mt-16 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold font-heading text-amber-800 dark:text-amber-200">
                {t('disclaimer.title')}
              </h2>
              <div className="mt-3 max-w-none text-amber-700 dark:text-amber-300 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: t('disclaimer.body') }} />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
