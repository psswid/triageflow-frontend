import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { HardDrive, Layers, EyeOff, Shield, CookieIcon } from 'lucide-react'
import { TableOfContents } from '../components/TableOfContents'

const cookiesSections = [
  { id: 'localStorage', Icon: HardDrive },
  { id: 'sessionStorage', Icon: Layers },
  { id: 'noTracking', Icon: EyeOff },
  { id: 'thirdParty', Icon: Shield },
  { id: 'consent', Icon: CookieIcon },
] as const

export default function CookiesPage() {
  const { t } = useTranslation('legal')

  const tocItems = cookiesSections.map(({ id }) => ({
    id,
    title: t(`cookies.sections.${id}.title`),
  }))

  return (
    <>
      <Helmet>
        <title>{t('cookies.title')} — TriageFlow</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold font-heading text-gray-900 dark:text-gray-100">{t('cookies.title')}</h1>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t('cookies.lastUpdated')}</p>

        <div className="mt-12 flex gap-12">
          <TableOfContents items={tocItems} />

          <div className="min-w-0 space-y-8">
            {cookiesSections.map(({ id, Icon }) => (
              <section
                key={id}
                id={id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                  <h2 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100">
                    {t(`cookies.sections.${id}.title`)}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(`cookies.sections.${id}.content`)}
                </p>
              </section>
            ))}

            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('cookies.banner')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
