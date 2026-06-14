import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { FlaskConical, Stethoscope, ShieldOff, Database, Scale } from 'lucide-react'
import { TableOfContents } from '../components/TableOfContents'

const termsSections = [
  { id: 'intro', Icon: Scale },
  { id: 'demo', Icon: FlaskConical },
  { id: 'noMedical', Icon: Stethoscope },
  { id: 'noLiability', Icon: ShieldOff },
  { id: 'data', Icon: Database },
  { id: 'changes', Icon: Scale },
] as const

export default function TermsPage() {
  const { t } = useTranslation('legal')

  const tocItems = termsSections.map(({ id }) => ({
    id,
    title: t(`terms.sections.${id}.title`),
  }))

  return (
    <>
      <Helmet>
        <title>{t('terms.title')} — TriageFlow</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100">{t('terms.title')}</h1>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t('terms.lastUpdated')}</p>

        <div className="mt-12 flex gap-12">
          <TableOfContents items={tocItems} />

          <div className="min-w-0 space-y-8">
            {termsSections.map(({ id, Icon }) => (
              <section
                key={id}
                id={id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                  <h2 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100">
                    {t(`terms.sections.${id}.title`)}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(`terms.sections.${id}.content`)}
                </p>
              </section>
            ))}

            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100">
                {t('terms.contact')}
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
