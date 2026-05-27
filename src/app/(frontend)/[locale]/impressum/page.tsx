import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'impressum' })
  return { title: t('title') }
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'impressum' })

  return (
    <div className="max-w-2xl mx-auto prose prose-sm px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('responsible')}</h2>
        <p className="text-gray-600">{t('placeholder')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('contact')}</h2>
        <p className="text-gray-600">{t('contactPlaceholder')}</p>
      </section>
    </div>
  )
}
