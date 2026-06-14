import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { TableOfContents } from '../components/TableOfContents'

const privacySectionIds = ['intro', 'data', 'openrouter', 'email', 'retention', 'rights']

export default function PrivacyPage() {
  const { t } = useTranslation('legal')

  const tocItems = privacySectionIds.map((id) => ({
    id,
    title: t(`privacy.sections.${id}.title`),
  }))

  return (
    <>
      <Helmet>
        <title>{t('privacy.title')} — TriageFlow</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100">{t('privacy.title')}</h1>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t('privacy.lastUpdated')}</p>

        <div className="mt-12 flex gap-12">
          <TableOfContents items={tocItems} />

          <div className="min-w-0 space-y-8">
            {privacySectionIds.map((id) => (
              <section
                key={id}
                id={id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
              >
                <h2 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100">
                  {t(`privacy.sections.${id}.title`)}
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(`privacy.sections.${id}.content`)}
                </p>
              </section>
            ))}

            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100">
                {t('privacy.contact')}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                contact@triageflow.dev
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
