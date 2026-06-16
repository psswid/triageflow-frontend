import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { StepCard } from '../components/StepCard'

export default function HowItWorksPage() {
  const { t } = useTranslation('howItWorks')

  return (
    <>
      <Helmet>
        <title>{t('title')} — TriageFlow</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">{t('subtitle')}</p>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-accent-300 to-primary-300 dark:from-primary-800 dark:via-accent-700 dark:to-primary-800" />

          <div className="flex flex-col gap-12">
            {([1, 2, 3, 4] as const).map((step) => (
              <StepCard
                key={step}
                step={step}
                title={t(`steps.${step}.title`)}
                description={t(`steps.${step}.description`)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-600 text-white px-8 py-4 text-lg font-semibold hover:bg-accent-700 transition-colors shadow-lg shadow-accent-600/30"
          >
            {t('cta')} <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="mt-6 text-sm text-gray-400 dark:text-gray-400 flex items-center justify-center gap-2">
            <FlaskConical className="w-4 h-4" />
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </>
  )
}
